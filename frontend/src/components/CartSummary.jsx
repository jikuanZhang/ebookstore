import { Button, Card, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

function CartSummary({ summary, formatPrice, onSubmitOrder }) {
  // 这个组件只展示汇总结果，不负责自己计算 totals。
  // 所有统计值都由父页面算好后再传进来。
  const navigate = useNavigate();

  return (
    <Card bordered={false}>
      <Space direction="vertical" size={8} className="full-width">
        <Text>商品种类：{summary.itemKinds} 件</Text>
        <Text>合计数量：{summary.totalCount} 本</Text>
        <Text strong className="price-text">
          应付总额：{formatPrice(summary.totalPrice)}
        </Text>
        <Space wrap>
          {/* 提交订单的真正处理逻辑由 CartPage 负责。 */}
          <Button type="primary" onClick={onSubmitOrder}>
            提交订单
          </Button>
          <Button onClick={() => navigate("/books")}>继续购书</Button>
        </Space>
      </Space>
    </Card>
  );
}

export default CartSummary;
