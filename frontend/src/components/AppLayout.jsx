import { Avatar, Button, Card, Layout, Menu, Space, Typography } from "antd";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSession, logout } from "../utils/store";

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

function AppLayout({ children }) {
  // AppLayout 是整站外壳：
  // 左侧负责菜单和用户信息，右侧负责展示当前路由页面内容。
  const navigate = useNavigate();
  const location = useLocation();
  const session = getSession();

  const selectedKey = useMemo(() => {
    // 根据当前地址决定菜单高亮项。
    // 这样无论是点击菜单进入，还是直接输入 URL，左侧状态都能保持正确。
    if (location.pathname.startsWith("/books")) {
      return "/books";
    }

    if (location.pathname.startsWith("/admin/books")) {
      return "/admin/books";
    }

    if (location.pathname.startsWith("/admin/users")) {
      return "/admin/users";
    }

    if (location.pathname.startsWith("/admin/orders")) {
      return "/admin/orders";
    }

    if (location.pathname.startsWith("/cart")) {
      return "/cart";
    }

    if (location.pathname.startsWith("/orders")) {
      return "/orders";
    }

    if (location.pathname.startsWith("/stats")) {
      return "/stats";
    }

    if (location.pathname.startsWith("/profile")) {
      return "/profile";
    }

    return "/books";
  }, [location.pathname]);

  // 菜单数据单独提出来，Menu 组件会按这个数组自动生成项。
  const isAdmin = session?.role === "ADMIN";
  const menuItems = isAdmin
    ? [
        { key: "/books", label: "Book List" },
        { key: "/admin/books", label: "Book Manage" },
        { key: "/admin/users", label: "User Manage" },
        { key: "/admin/orders", label: "All Orders" },
        { key: "/stats", label: "Statistics" },
        { key: "/profile", label: "My Profile" }
      ]
    : [
        { key: "/books", label: "Book List" },
        { key: "/cart", label: "My Cart" },
        { key: "/orders", label: "My Orders" },
        { key: "/stats", label: "My Stats" },
        { key: "/profile", label: "My Profile" }
      ];

  function handleMenuClick({ key }) {
    // key 就是上面 menuItems 里配置的路由地址。
    navigate(key);
  }

  function handleLogout() {
    // 清空本地登录信息后，回到登录页并替换历史记录，
    // 避免用户点击浏览器后退又回到受保护页面。
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <Layout className="app-layout">
      {/* 左侧边栏：品牌说明 + 菜单 + 当前用户卡片 */}
      <Sider width={248} className="app-sider" breakpoint="lg" collapsedWidth="0">
        <div className="app-brand">
          <Text className="app-brand__tag">Book Store</Text>
          <Title level={3} className="app-brand__title">
            云帆书苑
          </Title>
          <Text className="app-brand__text">
            基于 React、React Router、Ant Design 和 Spring Boot 的在线书店项目。
          </Text>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          className="app-menu"
        />

        <Card className="user-card" bordered={false}>
          <Space align="start">
            <Avatar size={48}>
              {(session?.username || "U").slice(0, 1).toUpperCase()}
            </Avatar>
            <div>
              <Text strong>{session?.username || "Guest"}</Text>
              <div>
              <Text type="secondary">{session?.role === "ADMIN" ? "Administrator" : "Customer"}</Text>
              </div>
            </div>
          </Space>
          <Button block type="primary" ghost onClick={handleLogout} className="user-card__button">
            Exit Login
          </Button>
        </Card>
      </Sider>

      {/* 右侧主区域：顶部栏显示当前登录人，下方插入具体页面内容 */}
      <Layout className="app-main-Layout">
        <Header className="app-header">
          <Space size="middle" align="center">
            <Avatar>
              {(session?.username || "U").slice(0, 1).toUpperCase()}
            </Avatar>
            <div>
              <Text className="app-header__title">Online Book Store</Text>
              <div>
                <Text type="secondary" className="app-header__meta">
                  当前用户：{session?.username || "游客"}
                </Text>
              </div>
            </div>
          </Space>
        </Header>
        <Content className="app-content">{children}</Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
