import { Button, Card, Form, Input, Space, Typography } from "antd";

const { Text } = Typography;

function ProfileFormCard({ form, profile, onFinish, onReset }) {
  return (
    <Card bordered={false}>
      {/* 这里把 form 实例从父页面传进来，
          这样父页面也能主动设置和重置表单内容。 */}
      <Form form={form} layout="vertical" initialValues={profile} onFinish={onFinish}>
        <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名" }]}>
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item label="姓名" name="fullName" rules={[{ required: true, message: "请输入姓名" }]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>

        <Form.Item label="邮箱" name="email" rules={[{ required: true, message: "请输入邮箱" }]}>
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item label="社交账号" name="social">
          <Input placeholder="请输入社交账号" />
        </Form.Item>

        <Form.Item label="简介" name="bio">
          <Input.TextArea rows={4} placeholder="请输入个人简介" />
        </Form.Item>

        <Space wrap>
          {/* Save 提交表单，Cancel 恢复到当前已保存的数据。 */}
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button onClick={onReset}>Cancel</Button>
        </Space>
      </Form>
      <Text type="secondary">头像使用 Avatar 占位，符合迭代1对个人信息页的基本展示要求。</Text>
    </Card>
  );
}

export default ProfileFormCard;
