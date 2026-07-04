import { Button, Card, DatePicker, Form, message, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { fetchBookSalesStats, fetchCustomerStats, fetchUserConsumptionStats } from "../services/api";
import { formatPrice, getSession } from "../utils/store";

const { Text } = Typography;

function dateFilters(values = {}) {
  const [startDate, endDate] = values.range || [];
  return {
    startDate: startDate?.format("YYYY-MM-DD"),
    endDate: endDate?.format("YYYY-MM-DD")
  };
}

function StatsPage() {
  const session = getSession();
  const isAdmin = session?.role === "ADMIN";
  const [bookStats, setBookStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [customerStats, setCustomerStats] = useState({ totalCount: 0, totalAmount: 0, books: [] });

  async function loadStats(values = {}) {
    try {
      const filters = dateFilters(values);
      if (isAdmin) {
        setBookStats(await fetchBookSalesStats(session.id, filters));
        setUserStats(await fetchUserConsumptionStats(session.id, filters));
      } else {
        setCustomerStats(await fetchCustomerStats(session.id, filters));
      }
    } catch (error) {
      message.error(error.message || "统计数据加载失败。");
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  const bookColumns = [
    { title: "书名", dataIndex: "title" },
    { title: "作者", dataIndex: "author" },
    { title: "销量", dataIndex: "salesCount" },
    { title: "销售额", dataIndex: "salesAmount", render: formatPrice }
  ];

  const userColumns = [
    { title: "用户名", dataIndex: "username" },
    { title: "购书总数", dataIndex: "bookCount" },
    { title: "累计消费", dataIndex: "totalAmount", render: formatPrice }
  ];

  return (
    <div className="full-width">
      <TopBar
        tag="Stats"
        title={isAdmin ? "销售统计" : "我的购书统计"}
        description={isAdmin ? "按时间范围统计热销榜和用户消费榜。" : "按时间范围统计自己的购书数量和总金额。"}
      />
      <Form layout="inline" onFinish={loadStats} style={{ marginTop: 20 }}>
        <Form.Item name="range">
          <DatePicker.RangePicker />
        </Form.Item>
        <Button type="primary" htmlType="submit">刷新统计</Button>
      </Form>

      {isAdmin ? (
        <Space direction="vertical" size={20} className="full-width" style={{ marginTop: 20 }}>
          <Card title="热销榜" bordered={false}>
            <Table rowKey="bookId" columns={bookColumns} dataSource={bookStats} pagination={false} />
          </Card>
          <Card title="消费榜" bordered={false}>
            <Table rowKey="userId" columns={userColumns} dataSource={userStats} pagination={false} />
          </Card>
        </Space>
      ) : (
        <Card bordered={false} style={{ marginTop: 20 }}>
          <Space direction="vertical" size={16} className="full-width">
            <Text>购书总本数：{customerStats.totalCount || 0} 本</Text>
            <Text strong className="price-text">累计消费：{formatPrice(customerStats.totalAmount || 0)}</Text>
            <Table rowKey="bookId" columns={bookColumns} dataSource={customerStats.books || []} pagination={false} />
          </Space>
        </Card>
      )}
    </div>
  );
}

export default StatsPage;
