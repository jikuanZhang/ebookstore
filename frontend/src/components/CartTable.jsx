import { Button, Card, InputNumber, Space, Table, Typography } from "antd";

const { Text } = Typography;

function CartTable({ cartItems, formatPrice, onQuantityChange, onRemove }) {
  // antd Table 的核心是 columns：
  // 每一列定义标题、取哪个字段、以及如何渲染单元格。
  const columns = [
    {
      title: "图书",
      dataIndex: "book",
      key: "book",
      render: (book) => (
        <Space>
          <img src={book.cover} alt={book.title} className="table-book-cover" />
          <div>
            <Text strong>{book.title}</Text>
            <div>
              <Text type="secondary">作者：{book.author}</Text>
            </div>
          </div>
        </Space>
      )
    },
    {
      title: "单价",
      dataIndex: "book",
      key: "price",
      render: (book) => book.priceText
    },
    {
      title: "数量",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, item) => (
        // 数量变化时，把“图书 id + 新数量”交回父页面统一处理。
        <InputNumber min={1} value={item.quantity} onChange={(value) => onQuantityChange(item.book.id, value)} />
      )
    },
    {
      title: "小计",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (subtotal) => formatPrice(subtotal)
    },
    {
      title: "操作",
      key: "action",
      render: (_, item) => (
        <Button danger onClick={() => onRemove(item.book.id)}>
          删除
        </Button>
      )
    }
  ];

  return (
    <Card bordered={false}>
      {/* rowKey 告诉 Table：每一行唯一身份是谁，方便 React 稳定更新列表。 */}
      <Table rowKey={(item) => item.book.id} columns={columns} dataSource={cartItems} pagination={false} />
    </Card>
  );
}

export default CartTable;
