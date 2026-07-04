// login的ui层, 不负责逻辑

import { Button, Card, Checkbox, Form, Input, Space, Tabs, Typography } from "antd";

const { Paragraph, Title } = Typography;

function LoginFormCard({ onFinish, onGuestBrowse, onRegister }) {
  return (
    <Card className="login-card" bordered={false}>
      {/* 这个组件只负责渲染登录表单；
          登录成功后要做什么，由父页面传入 onFinish 决定。 */}
      <Title level={2} className="login-card__eyebrow">云帆书苑登录</Title>
      <Paragraph>使用数据库中的账号登录，例如 reader / 123456 或 admin / admin123。</Paragraph>

      <Tabs
        defaultActiveKey="login"
        items={[
          {
            key: "login",
            label: "登录",
            children: (
              <Form layout="vertical" onFinish={onFinish} initialValues={{ remember: true }}>
                {/* required: true 说明目前的项目只检查有没有输入, 不检查内容*/}
                <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名" }]}>
                  <Input placeholder="请输入用户名" />
                </Form.Item>

                <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
                  <Input.Password placeholder="请输入密码" />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>记住我</Checkbox>
                </Form.Item>

                <Space direction="vertical" size="middle" className="full-width">
                  <Button type="primary" htmlType="submit" block>
                    登录进入书城
                  </Button>
                  {/* 游客按钮走另一条逻辑，不提交表单，而是直接触发访客进入。 */}
                  <Button block onClick={onGuestBrowse}>
                    游客浏览
                  </Button>
                </Space>
              </Form>
            )
          },
          {
            key: "register",
            label: "注册",
            children: (
              <Form layout="vertical" onFinish={onRegister}>
                <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名" }]}>
                  <Input placeholder="请输入用户名" />
                </Form.Item>

                <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
                  <Input.Password placeholder="请输入密码" />
                </Form.Item>

                <Form.Item
                  label="确认密码"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "请再次输入密码" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("两次输入的密码不一致"));
                      }
                    })
                  ]}
                >
                  <Input.Password placeholder="请再次输入密码" />
                </Form.Item>

                <Form.Item
                  label="邮箱"
                  name="email"
                  rules={[
                    { required: true, message: "请输入邮箱" },
                    { type: "email", message: "邮箱格式不正确" }
                  ]}
                >
                  <Input placeholder="请输入邮箱" />
                </Form.Item>

                <Form.Item label="昵称" name="nickname">
                  <Input placeholder="请输入昵称" />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                  注册并进入书城
                </Button>
              </Form>
            )
          }
        ]}
      />
    </Card>
  );
}

export default LoginFormCard;
