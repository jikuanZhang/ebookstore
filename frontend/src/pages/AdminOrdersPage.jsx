import { Button, DatePicker, Form, Input, message, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { fetchAdminOrders } from "../services/api";
import { getSession } from "../utils/store";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const session = getSession();

  async function loadOrders(values = {}) {
    try {
      const [startDate, endDate] = values.range || [];
      setOrders(await fetchAdminOrders(session.id, {
        startDate: startDate?.format("YYYY-MM-DD"),
        endDate: endDate?.format("YYYY-MM-DD"),
        bookName: values.bookName
      }));
    } catch (error) {
      message.error(error.message || "订单列表加载失败。");
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const columns = [
    { title: "订单号", dataIndex: "number" },
    { title: "用户", dataIndex: "username" },
    { title: "下单时间", dataIndex: "time" },
    { title: "包含图书", dataIndex: "booksText" },
    { title: "金额", dataIndex: "amountText" },
    { title: "状态", dataIndex: "status", render: () => <Tag color="success">已完成</Tag> }
  ];

  return (
    <div className="full-width">
      <TopBar tag="Admin" title="全站订单" description="管理员可以按时间范围和书名筛选系统中所有订单。" />
      <Form layout="inline" onFinish={loadOrders} style={{ marginTop: 20 }}>
        <Form.Item name="range">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item name="bookName">
          <Input placeholder="按书名筛选" />
        </Form.Item>
        <Button type="primary" htmlType="submit">筛选</Button>
      </Form>
      <div style={{ marginTop: 20 }}>
        <Table rowKey="id" columns={columns} dataSource={orders} />
      </div>
    </div>
  );
}

export default AdminOrdersPage;
