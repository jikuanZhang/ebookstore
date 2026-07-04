import { Button, DatePicker, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import OrderHistoryList from "../components/OrderHistoryList";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import { searchOrders } from "../services/api";
import { getSession } from "../utils/store";

function OrdersPage() {
  // 订单页直接展示后端数据库里的订单记录。
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const session = getSession();
    if (!session?.id) {
      message.warning("请先登录后查看订单。");
      navigate("/login", { replace: true });
      return;
    }

    searchOrders(session.id)
      .then(setOrders)
      .catch((error) => {
        message.error(error.message || "订单列表加载失败，请确认后端已启动。");
      });
  }, [navigate]);

  async function handleSearch(values) {
    const session = getSession();
    const [startDate, endDate] = values.range || [];
    try {
      const data = await searchOrders(session.id, {
        startDate: startDate?.format("YYYY-MM-DD"),
        endDate: endDate?.format("YYYY-MM-DD"),
        bookName: values.bookName
      });
      setOrders(data);
    } catch (error) {
      message.error(error.message || "订单筛选失败。");
    }
  }

  return (
    <div className="full-width">
      <TopBar
        tag="Orders"
        title="我的订单"
        description="下单后生成的订单会保存到数据库，并在这里按时间倒序展示。"
      />
      <Form layout="inline" onFinish={handleSearch} style={{ marginTop: 20 }}>
        <Form.Item name="range">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item name="bookName">
          <Input placeholder="按书名筛选" />
        </Form.Item>
        <Button type="primary" htmlType="submit">筛选</Button>
      </Form>
      <div style={{ marginTop: 20 }}>
        {/* 返回按钮逻辑继续交给页面处理，列表组件保持展示型职责。 */}
        <OrderHistoryList orders={orders} onBackToCart={() => navigate("/cart")} />
      </div>
    </div>
  );
}

export default OrdersPage;
