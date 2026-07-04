import { message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartSummary from "../components/CartSummary";
import CartTable from "../components/CartTable";
import EmptyState from "../components/EmptyState";
import TopBar from "../components/TopBar";
import { createOrder, fetchCart, removeCartItem, updateCartItem } from "../services/api";
import { formatPrice, getSession } from "../utils/store";

function buildSummary(items) {
  return items.reduce(
    (summary, item) => ({
      itemKinds: summary.itemKinds + 1,
      totalCount: summary.totalCount + item.quantity,
      totalPrice: summary.totalPrice + item.subtotal
    }),
    {
      itemKinds: 0,
      totalCount: 0,
      totalPrice: 0
    }
  );
}

function CartPage() {
  // 购物车页的职责是把后端数据库里的购物车数据同步成页面状态。
  // cartItems 保存“购物车中每一项的完整信息”，供表格直接渲染。
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // summary 保存汇总信息，避免在 JSX 里重复做统计计算。
  const [summary, setSummary] = useState({
    itemKinds: 0,
    totalCount: 0,
    totalPrice: 0
  });

  function applyCart(items) {
    setCartItems(items);
    setSummary(buildSummary(items));
  }

  async function syncCart() {
    const session = getSession();
    if (!session?.id) {
      message.warning("请先登录后查看购物车。");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const items = await fetchCart(session.id);
      applyCart(items);
    } catch (error) {
      message.error(error.message || "购物车加载失败，请确认后端已启动。");
    }
  }

  useEffect(() => {
    // 页面首次进入时，从后端读取当前用户购物车。
    syncCart();
  }, []);

  async function handleQuantityChange(bookId, value) {
    // InputNumber 清空时可能给出 null，所以这里兜底到 1。
    const session = getSession();
    if (!session?.id) {
      return;
    }

    try {
      const items = await updateCartItem(session.id, bookId, value || 1);
      applyCart(items);
      message.success("购物车数量已更新。");
    } catch (error) {
      message.error(error.message || "购物车数量更新失败。");
    }
  }

  async function handleRemove(bookId) {
    const session = getSession();
    if (!session?.id) {
      return;
    }

    try {
      const items = await removeCartItem(session.id, bookId);
      applyCart(items);
      message.success("图书已从购物车中移除。");
    } catch (error) {
      message.error(error.message || "移除图书失败。");
    }
  }

  async function handleSubmitOrder() {
    if (!cartItems.length) {
      message.warning("购物车为空，暂时无法提交订单。");
      return;
    }

    const session = getSession();
    if (!session?.id) {
      return;
    }

    try {
      const order = await createOrder(session.id);
      applyCart([]);
      message.success(`订单 ${order.number} 已提交。`);
      navigate("/orders");
    } catch (error) {
      message.error(error.message || "提交订单失败。");
    }
  }

  return (
    <div className="full-width">
      <TopBar
        tag="Cart"
        title="购物车页"
        description="本页从 Spring Boot 后端读取数据库中的购物车数据，支持修改数量、删除图书和提交订单。"
      />

      {/* 购物车有数据时显示表格和汇总，否则显示空状态。 */}
      <div style={{ marginTop: 20 }}>
        {cartItems.length > 0 ? (
          <>
            <CartTable
              cartItems={cartItems}
              formatPrice={formatPrice}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
            <div style={{ marginTop: 20 }}>
              <CartSummary summary={summary} formatPrice={formatPrice} onSubmitOrder={handleSubmitOrder} />
            </div>
          </>
        ) : (
          <EmptyState title="购物车还是空的" text="先去图书列表挑几本书，再回来这里查看。" actionLabel="去书籍列表" />
        )}
      </div>
    </div>
  );
}

export default CartPage;
