import { Button, Card, Empty, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

function EmptyState({ title, text, actionLabel = "返回书籍列表", to = "/books" }) {
  return (
    // 统一的空状态组件：
    // 当搜索无结果，或者详情页 id 不存在时，都可以复用它。
    <Card className="empty-state" bordered={false}>
      <Empty
        // antd Empty 默认只是一张空图和一行文案；
        // 这里把 description 改造成更完整的标题 + 说明文字。
        description={
          <>
            <Title level={4} className="empty-state__title">
              {title}
            </Title>
            <Paragraph className="empty-state__text">{text}</Paragraph>
          </>
        }
      >
        <Link to={to}>
          <Button type="primary">{actionLabel}</Button>
        </Link>
      </Empty>
    </Card>
  );
}

export default EmptyState;
