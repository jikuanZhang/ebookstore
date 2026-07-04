import { Button, Card, List, Tag, Typography } from "antd";

const { Text } = Typography;

function OrderHistoryList({ orders, onBackToCart }) {
  return (
    <Card bordered={false}>
      <List
        dataSource={orders}
        renderItem={(order) => (
          // 每个 order 都是一条历史订单记录。
          <List.Item
            actions={[
              <Button key="back-cart" onClick={onBackToCart}>
                返回购物车
              </Button>
            ]}
          >
            <List.Item.Meta
              title={`订单号：${order.number}`}
              description={
                <>
                  <div>下单时间：{order.time}</div>
                  <div>包含图书：{order.booksText}</div>
                  <div>订单金额：{order.amountText}</div>
                </>
              }
            />
            {/* Tag 根据订单状态切换颜色和文案。 */}
            <Tag color={order.status === "completed" ? "success" : "processing"}>
              {order.status === "completed" ? "已完成" : "待付款"}
            </Tag>
          </List.Item>
        )}
      />
      <Text type="secondary">订单数据来自 Spring Boot 后端，提交购物车后会写入 MySQL 数据库。</Text>
      <div style={{ marginTop: 16 }}>
        <Button onClick={onBackToCart}>返回购物车</Button>
      </div>
    </Card>
  );
}

export default OrderHistoryList;
