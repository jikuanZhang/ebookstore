// login的逻辑层, 不负责ui
import { message } from "antd";
import LoginFormCard from "../components/LoginFormCard";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";
import { login } from "../utils/store";

function LoginPage() {
  // 登录页只负责处理“进入系统”的两种方式：普通登录和游客浏览。
  const navigate = useNavigate();

  async function handleFinish(values) {
    try {
      const user = await loginUser(values);
      login(user);
      message.success("登录成功，已进入书城页面。");
      navigate("/books", { replace: true });
    } catch (error) {
      message.error(error.message || "登录失败，请检查用户名和密码。");
    }
  }

  async function handleRegister(values) {
    try {
      const user = await registerUser(values);
      login(user);
      message.success("注册成功，已进入书城页面。");
      navigate("/books", { replace: true });
    } catch (error) {
      message.error(error.message || "注册失败，请更换用户名后重试。");
    }
  }

  async function handleGuestBrowse() {
    try {
      const user = await loginUser({ username: "guest", password: "guest123" });
      login(user);
      message.success("已使用游客账号进入书城。");
      navigate("/books", { replace: true });
    } catch (error) {
      message.error(error.message || "游客账号登录失败，请确认后端已启动。");
    }
  }

  return (
    <div className="login-page">
      {/* 具体表单 UI 放到组件里，页面只保留流程控制逻辑。 */}
      <LoginFormCard
        onFinish={handleFinish}
        onGuestBrowse={handleGuestBrowse}
        onRegister={handleRegister}
      />
    </div>
  );
}

export default LoginPage;
