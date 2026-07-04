import { message } from "antd";
import { useEffect, useState } from "react";
import BookDetail from "../components/BookDetail";
import EmptyState from "../components/EmptyState";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getBookById, getRelatedBooks } from "../utils/bookHelpers";
import { addCartItem, fetchBookById, fetchCart, toBackendId } from "../services/api";
import { getSession } from "../utils/store";

function BookDetailPage() {
  // 详情页负责“准备数据 + 定义交互”，
  // 真正的页面结构由 BookDetail 组件负责展示。
  // id 来自地址栏 /books/:id。
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const session = getSession();
  const canPurchase = session?.role !== "ADMIN";

  // 如果列表页跳转时传了 state.book，就优先使用它；
  // 否则再根据 URL 中的 id 去本地数据里查找。

  const stateBook = location.state?.book;
  const localBook = stateBook?.id === id ? stateBook : getBookById(id);
  const [book, setBook] = useState(localBook);

  // 相关推荐依赖当前图书存在后才能计算。
  const relatedBooks = book ? getRelatedBooks(book.id, 3) : [];
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    // 详情页同样优先请求后端；请求失败时使用路由 state 或本地 JSON 查到的数据。
    let ignore = false;

    setBook(localBook);

    fetchBookById(id)
      .then((remoteBook) => {
        if (!ignore) {
          setBook(remoteBook);
        }
      })
      .catch(() => {
        if (!ignore) {
          setBook(localBook);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id, localBook]);

  useEffect(() => {
    // 切换详情页中的图书时，重新从后端购物车同步当前数量。
    const session = getSession();
    if (!book || !session?.id || session.role === "ADMIN") {
      setCartQuantity(0);
      return;
    }

    let ignore = false;

    fetchCart(session.id)
      .then((items) => {
        if (!ignore) {
          const matchedItem = items.find((item) => item.book.backendId === toBackendId(book.id));
          setCartQuantity(matchedItem ? matchedItem.quantity : 0);
        }
      })
      .catch(() => {
        if (!ignore) {
          setCartQuantity(0);
        }
      });

    return () => {
      ignore = true;
    };
  }, [book]);

  async function handleAddToCart() {
    if (!book) {
      return false;
    }

    const session = getSession();
    if (!session?.id) {
      message.warning("请先登录后再加入购物车。");
      navigate("/login", { replace: true });
      return false;
    }

    if (session.role === "ADMIN") {
      message.info("管理员账号用于管理书店，不参与购物车和下单流程。");
      return false;
    }

    try {
      const item = await addCartItem(session.id, book.backendId || book.id, 1);
      setCartQuantity(item.quantity);
      message.success(`已加入购物车，当前这本书在购物车中共有 ${item.quantity} 本。`);
      return true;
    } catch (error) {
      message.error(error.message || "加入购物车失败，请确认后端已启动。");
      return false;
    }
  }

  async function handleBuyNow() {
    if (!book) {
      return;
    }

    const added = await handleAddToCart();
    if (added) {
      navigate("/cart");
    }
  }

  // 如果地址中的 id 对应不到任何图书，就给出兜底页面。
  if (!book) {
    return <EmptyState title="未找到对应图书" text="当前地址中的图书编号没有匹配到有效数据。" />;
  }

  return (
    <BookDetail
      book={book}
      relatedBooks={relatedBooks}
      // 用 React 状态驱动数量显示，点击加入购物车后会立刻刷新。
      cartQuantity={cartQuantity}
      canPurchase={canPurchase}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
      onBackToList={() => navigate("/books")}
    />
  );
}

export default BookDetailPage;
