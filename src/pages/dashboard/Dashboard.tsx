import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Dropdown } from "antd";
import logo from "../../assets/images/logo.svg";
import "../../locales/i18n"; // Ensure this is imported

const { Header, Sider, Content } = Layout;

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/login"; 
  };

  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    console.log(lng);
  };
  

  const languageMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => handleChangeLanguage("en")}>
        {t("English")}
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handleChangeLanguage("ru")}>
        {t("Русский")}
      </Menu.Item>
      <Menu.Item key="3" onClick={() => handleChangeLanguage("uz")}>
        {t("O‘zbek")}
      </Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/profile">{t("Profile")}</Link>
      </Menu.Item>
      <Menu.Item key="2" danger onClick={handleLogout}>
        {t("Logout")}
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo-container">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: collapsed ? "24px" : "60px",
              height: "auto",
              margin: "16px",
              paddingLeft: "16px",
            }}
          />
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item
            className=" capitalize"
            key="1"
            icon={<DashboardOutlined />}
          >
            <Link to="/">{t("header.dashboard")}</Link>
          </Menu.Item>
          <Menu.Item className=" capitalize" key="2" icon={<UserOutlined />}>
            <Link to="/users">{t("header.users")}</Link>
          </Menu.Item>
          <Menu.Item
            className=" capitalize"
            key="3"
            icon={<AppstoreAddOutlined />}
          >
            <Link to="/products">{t("header.products")}</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Dropdown
            overlay={languageMenu}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<GlobalOutlined />}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                float: "right",
              }}
            />
          </Dropdown>
          <Dropdown
            overlay={userMenu}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<UserOutlined />}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                float: "right",
                marginRight: "10px",
              }}
            />
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
