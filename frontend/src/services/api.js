const API_BASE = "/api/v1";

function normalizeBackendBook(book) {
  // 后端返回数字 id 和数字库存，这里转换成前端组件原本习惯使用的展示格式。
  const numericId = String(book.id);
  const localId = numericId.startsWith("book-") ? numericId : `book-${numericId}`;
  const price = Number(book.price || 0);
  const stockCount = Number(book.stock || 0);

  return {
    ...book,
    id: localId,
    backendId: numericId,
    price,
    priceText: `¥${price.toFixed(2)}`,
    stock: stockCount > 0 ? `库存 ${stockCount} 本` : "暂时缺货",
    stockCount,
    isbn: book.isbn || "",
    category: book.category || "数据库图书",
    intro: book.intro || book.description,
    audience: book.audience || "适合课程作业演示和在线书店用户浏览。",
    reason: book.reason || "数据来自 Spring Boot 后端和 MySQL 数据库。"
  };
}

function buildQuery(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });
  const value = search.toString();
  return value ? `?${value}` : "";
}

export function toBackendId(id) {
  // 前端路由可能是 book-1，后端接口需要 1，所以请求前统一转换。
  const value = String(id || "");
  return value.startsWith("book-") ? value.replace("book-", "") : value;
}

async function requestJson(path, options) {
  // 所有请求共用这一层，负责拼接路径、设置 JSON 请求头和处理错误状态。
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    let errorMessage = `Request failed: ${response.status}`;
    try {
      const data = await response.json();
      errorMessage = data.message || errorMessage;
    } catch (error) {
      // 有些错误响应没有 JSON 正文，这里保留默认状态码信息。
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function normalizeCartItem(item) {
  const book = normalizeBackendBook(item.book);
  const quantity = Number(item.quantity || 0);
  const subtotal = Number(item.subtotal || book.price * quantity);

  return {
    ...item,
    book,
    quantity,
    subtotal
  };
}

function formatOrderTime(value) {
  if (!value) {
    return "";
  }
  return value.replace("T", " ").slice(0, 16);
}

function normalizeOrder(order) {
  const items = Array.isArray(order.items) ? order.items : [];
  const amount = Number(order.totalAmount || 0);

  return {
    ...order,
    id: `order-${order.id}`,
    number: order.number,
    userId: order.userId,
    username: order.username,
    time: formatOrderTime(order.createdAt),
    booksText: items.map((item) => `${item.title} x${item.quantity}`).join("、"),
    amount,
    amountText: `¥${amount.toFixed(2)}`,
    status: order.status || "completed",
    items
  };
}

export async function fetchBooks() {
  // 获取书籍列表，供 BooksPage 使用。
  const data = await requestJson("/books");
  return data.map(normalizeBackendBook);
}

export async function searchBooks(keyword) {
  const data = await requestJson(`/books${buildQuery({ keyword })}`);
  return data.map(normalizeBackendBook);
}

export async function fetchBookById(id) {
  // 获取单本书详情，供 BookDetailPage 使用。
  const data = await requestJson(`/book/${toBackendId(id)}`);
  return normalizeBackendBook(data);
}

export async function registerUser(form) {
  // 用户注册接口，供以后注册表单或 Postman 对接。
  return requestJson("/users/register", {
    method: "POST",
    body: JSON.stringify(form)
  });
}

export async function loginUser(form) {
  return requestJson("/users/login", {
    method: "POST",
    body: JSON.stringify(form)
  });
}

export async function fetchCart(userId) {
  const data = await requestJson(`/users/${userId}/cart`);
  return data.map(normalizeCartItem);
}

export async function addCartItem(userId, bookId, quantity = 1) {
  const data = await requestJson(`/users/${userId}/cart`, {
    method: "POST",
    body: JSON.stringify({
      bookId: Number(toBackendId(bookId)),
      quantity
    })
  });
  return normalizeCartItem(data);
}

export async function updateCartItem(userId, bookId, quantity) {
  const data = await requestJson(`/users/${userId}/cart/${toBackendId(bookId)}`, {
    method: "PUT",
    body: JSON.stringify({ quantity })
  });
  return data.map(normalizeCartItem);
}

export async function removeCartItem(userId, bookId) {
  const data = await requestJson(`/users/${userId}/cart/${toBackendId(bookId)}`, {
    method: "DELETE"
  });
  return data.map(normalizeCartItem);
}

export async function clearRemoteCart(userId) {
  return requestJson(`/users/${userId}/cart`, {
    method: "DELETE"
  });
}

export async function createOrder(userId) {
  const data = await requestJson(`/users/${userId}/orders`, {
    method: "POST"
  });
  return normalizeOrder(data);
}

export async function fetchOrders(userId) {
  const data = await requestJson(`/users/${userId}/orders`);
  return data.map(normalizeOrder);
}

export async function searchOrders(userId, filters = {}) {
  const data = await requestJson(`/users/${userId}/orders${buildQuery(filters)}`);
  return data.map(normalizeOrder);
}

export async function fetchCustomerStats(userId, filters = {}) {
  return requestJson(`/users/${userId}/orders/stats${buildQuery(filters)}`);
}

export async function fetchUsers(adminId) {
  return requestJson(`/users/admin${buildQuery({ adminId })}`);
}

export async function updateUserStatus(adminId, userId, enabled) {
  return requestJson(`/users/admin/${userId}/status${buildQuery({ adminId })}`, {
    method: "PATCH",
    body: JSON.stringify({ enabled })
  });
}

export async function createBook(adminId, form) {
  const data = await requestJson(`/admin/books${buildQuery({ adminId })}`, {
    method: "POST",
    body: JSON.stringify(form)
  });
  return normalizeBackendBook(data);
}

export async function updateBook(adminId, bookId, form) {
  const data = await requestJson(`/admin/books/${toBackendId(bookId)}${buildQuery({ adminId })}`, {
    method: "PUT",
    body: JSON.stringify(form)
  });
  return normalizeBackendBook(data);
}

export async function deleteBook(adminId, bookId) {
  return requestJson(`/admin/books/${toBackendId(bookId)}${buildQuery({ adminId })}`, {
    method: "DELETE"
  });
}

export async function fetchAdminOrders(adminId, filters = {}) {
  const data = await requestJson(`/admin/orders${buildQuery({ adminId, ...filters })}`);
  return data.map(normalizeOrder);
}

export async function fetchBookSalesStats(adminId, filters = {}) {
  return requestJson(`/admin/stats/books${buildQuery({ adminId, ...filters })}`);
}

export async function fetchUserConsumptionStats(adminId, filters = {}) {
  return requestJson(`/admin/stats/users${buildQuery({ adminId, ...filters })}`);
}
