import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Input, Popconfirm, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const Users: React.FC = () => {
  interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const langData = useTranslation();


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>("http://localhost:3000/users");
        setUsers(response.data);
        setFilteredUsers(response.data); // Set initial filtered users
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAdd = () => {
    setIsEditing(false);
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setIsEditing(true);
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
      message.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      message.error("Failed to delete user");
    }
  };

  const handleSubmit = async (values: Omit<User, "id">) => {
    try {
      if (isEditing && editingUser) {
        await axios.put(
          `http://localhost:3000/users/${editingUser.id}`,
          values
        );
        const updatedUser = { ...editingUser, ...values };
        setUsers(
          users.map((user) => (user.id === editingUser.id ? updatedUser : user))
        );
        setFilteredUsers(
          filteredUsers.map((user) =>
            user.id === editingUser.id ? updatedUser : user
          )
        );
        message.success("User updated successfully");
      } else {
        const response = await axios.post<User>(
          "http://localhost:3000/users",
          values
        );
        setUsers([...users, response.data]);
        setFilteredUsers([...filteredUsers, response.data]);
        message.success("User added successfully");
      }
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to save user:", error);
      message.error("Failed to save user");
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const lowercasedValue = value.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.firstName.toLowerCase().includes(lowercasedValue) ||
            user.lastName.toLowerCase().includes(lowercasedValue) ||
            user.email.toLowerCase().includes(lowercasedValue) ||
            user.phone.toLowerCase().includes(lowercasedValue)
        )
      );
    } else {
      setFilteredUsers(users);
    }
    setCurrentPage(1);
  };

  const columns = [
    {
      title: langData.t("users.firstName"),
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: langData.t("users.lastName"),
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: langData.t("users.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: langData.t("users.phone"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: langData.t("users.actions"),
      key: "actions",
      render: (_: unknown, record: User) => (
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center" }}>
        <Input
          placeholder={langData.t("users.searchUsers")}
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300, marginRight: 16 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {langData.t("users.addUser")}
        </Button>
      </div>
      <Table
        dataSource={filteredUsers.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredUsers.length,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
          showSizeChanger: true, // Allows changing page size
          onShowSizeChange: (size) => setPageSize(size),
        }}
      />
      <Modal
        title={isEditing ? "Edit User" : "Add User"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={isEditing && editingUser ? editingUser : {}}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please input the user's first name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              { required: true, message: "Please input the user's last name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the user's email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              {
                required: true,
                message: "Please input the user's phone number!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
