import { Avatar, Card, Space, Typography } from "antd";

const { Paragraph, Title } = Typography;

function ProfileHeader({ username }) {
  return (
    <Card bordered={false}>
      <Space size="large" align="start">
        {/* 没有真实头像时，使用用户名首字母作为占位显示。 */}
        <Avatar size={80}>{(username || "U").slice(0, 1).toUpperCase()}</Avatar>
        <div>
          <Title level={2} className="no-margin">
            个人信息页
          </Title>
          <Paragraph className="no-margin">
            这里展示当前登录账号的补充资料，便于和订单、购物车等用户数据区分管理。
          </Paragraph>
        </div>
      </Space>
    </Card>
  );
}

export default ProfileHeader;
