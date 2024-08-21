import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Spin,
  message,
  Modal,
  Form,
  Input,
  Button,
  Select,
} from "antd";
import axios from "axios";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next"; // Import useTranslation

const { Option } = Select;

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string;
}

const Products: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("ascend");
  const langData = useTranslation();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(
          "http://localhost:3000/products"
        );
        const productsWithNumberPrice = response.data.map((product) => ({
          ...product,
          price: Number(product.price),
        }));
        setProducts(productsWithNumberPrice);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        message.error(t("failedToLoadProducts"));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [t]);

  const handleAdd = () => {
    setIsEditing(false);
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setIsEditing(true);
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: t("deleteConfirmTitle"),
      content: t("deleteConfirmContent"),
      okText: t("delete"),
      okType: "danger",
      cancelText: t("cancel"),
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3000/products/${id}`);
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== id)
          );
          message.success(t("productDeleted"));
        } catch (error) {
          console.error("Failed to delete product:", error);
          message.error(t("failedToDeleteProduct"));
        }
      },
    });
  };

  const handleSubmit = async (values: Omit<Product, "id">) => {
    try {
      if (isEditing && editingProduct) {
        await axios.put(`http://localhost:3000/products/${editingProduct.id}`, {
          ...values,
          price: Number(values.price),
        });
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === editingProduct.id
              ? { ...product, ...values, price: Number(values.price) }
              : product
          )
        );
        message.success(t("productUpdated"));
      } else {
        const response = await axios.post<Product>(
          "http://localhost:3000/products",
          {
            ...values,
            price: Number(values.price),
          }
        );
        setProducts((prevProducts) => [...prevProducts, response.data]);
        message.success(t("productAdded"));
      }
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to save product:", error);
      message.error(t("failedToSaveProduct"));
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "ascend") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  if (loading) return <Spin size="large" />;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Input
          placeholder={langData.t("product.searchByTitle")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ marginRight: 16, width: 300 }}
        />
        <Select
          defaultValue="ascend"
          style={{ width: 150, marginRight: 16 }}
          onChange={(value) => setSortOrder(value)}
        >
          <Option value="ascend">{langData.t("product.priceAscending")}</Option>
          <Option value="descend">{langData.t("product.priceDescending")}</Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {langData.t("product.addNewProduct")}
        </Button>
      </div>
      <Row gutter={16}>
        {sortedProducts.map((product) => (
          <Col span={8} key={product.id} className="mb-4">
            <Card
              bordered={false}
              className="rounded-lg shadow-lg flex flex-col"
              cover={
                <img
                  alt={product.title}
                  src={product.images}
                  className="rounded-t-lg object-cover h-[200px] w-full"
                />
              }
            >
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold mb-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-700 mb-2">{product.description}</p>
                </div>
                <p className="text-xl font-bold text-green-600 mb-0">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex justify-end mt-2">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(product)}
                  />
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(product.id)}
                    danger
                  />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title={isEditing ? t("editProduct") : t("addProduct")}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={isEditing && editingProduct ? editingProduct : {}}
        >
          <Form.Item
            name="title"
            label={t("title")}
            rules={[{ required: true, message: t("inputTitle") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label={t("description")}
            rules={[
              {
                required: true,
                message: t("inputDescription"),
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="price"
            label={t("price")}
            rules={[{ required: true, message: t("inputPrice") }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item
            name="images"
            label={t("imageURL")}
            rules={[{ required: true, message: t("inputImageURL") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? t("update") : t("add")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
