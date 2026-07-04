import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import BookDetailPage from "./pages/BookDetailPage";
import BooksPage from "./pages/BooksPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import AdminBooksPage from "./pages/AdminBooksPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import StatsPage from "./pages/StatsPage";
import { getSession } from "./utils/store";

function HomeRedirect() {
  const session = getSession();
  return <Navigate to={session ? "/books" : "/login"} replace />;
}

// 没有登录踢回登录页
function RequireAuth({ children }) {
  const session = getSession();
  if (!session) {return <Navigate to="/login" replace />;}
  return children;
}

// 如果已经登录了就返回"/book"
function LoginRedirect({ children }) {
  const session = getSession();

  if (session) {
    return <Navigate to="/books" replace />;
  }

  return children;
}

// 含有AppLayout组件的, 要check登录情况
function withAppLayout(page) {
  return (
    // 判断有没有登录
    <RequireAuth>
      {/*AppLayOut包裹*/}
      <AppLayout>{page}</AppLayout>
    </RequireAuth>
  );
}

function withAdminLayout(page) {
  return (
    <RequireAuth>
      <RequireAdmin>
        <AppLayout>{page}</AppLayout>
      </RequireAdmin>
    </RequireAuth>
  );
}

function withCustomerLayout(page, redirectTo = "/books") {
  return (
    <RequireAuth>
      <RequireCustomer redirectTo={redirectTo}>
        <AppLayout>{page}</AppLayout>
      </RequireCustomer>
    </RequireAuth>
  );
}

function RequireAdmin({ children }) {
  const session = getSession();
  if (session?.role !== "ADMIN") {
    return <Navigate to="/books" replace />;
  }
  return children;
}

function RequireCustomer({ children, redirectTo }) {
  const session = getSession();
  if (session?.role === "ADMIN") {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      {/*根据登录状况决定是去"/book"还是"/login"*/}
      <Route path="/" element={<HomeRedirect />} />
      {/*如果已经登录了就返回"/book"*/}
      <Route path="/login" element={<LoginRedirect> <LoginPage /> </LoginRedirect>} />
      {/*登录这些都需要check登录情况, 没登录送回"/login"*/}
      <Route path="/books" element={withAppLayout(<BooksPage />)} />
      <Route path="/books/:id" element={withAppLayout(<BookDetailPage />)} />
      <Route path="/cart" element={withCustomerLayout(<CartPage />, "/books")} />
      <Route path="/profile" element={withAppLayout(<ProfilePage />)} />
      <Route path="/orders" element={withCustomerLayout(<OrdersPage />, "/admin/orders")} />
      <Route path="/stats" element={withAppLayout(<StatsPage />)} />
      <Route path="/admin/books" element={withAdminLayout(<AdminBooksPage />)} />
      <Route path="/admin/users" element={withAdminLayout(<AdminUsersPage />)} />
      <Route path="/admin/orders" element={withAdminLayout(<AdminOrdersPage />)} />
      {/*兜底, 送回根目录*/}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
