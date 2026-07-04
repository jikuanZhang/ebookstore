import { books } from "./bookHelpers";

const CART_STORAGE_KEY = "ebook_store_cart";
const USER_STORAGE_KEY = "ebook_store_user";
const PROFILE_STORAGE_KEY = "ebook_store_profile";
const DEFAULT_PROFILE = {
  username: "reader",
  fullName: "云帆书苑用户",
  email: "reader@example.com",
  social: "@ebook_reader",
  bio: "喜欢阅读前端、设计和文学类书籍，当前数据为本地 mock 信息。"
};

// 判断当前代码是否运行在浏览器环境中
function isBrowser() {
  return typeof window !== "undefined";
}

function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

export function formatPrice(value) {
  return `¥${Number(value).toFixed(2)}`;
}

export function getSession() {
  if (!isBrowser()) {
    return null;
  }
  // window.localStorage.getItem(USER_STORAGE_KEY): 在浏览器
  // 本地存储中, 拿出键名为USER_STORAGE_KEY的值
  // safeParse把getItem取出的string重新转回对象
  return safeParse(window.localStorage.getItem(USER_STORAGE_KEY), null);
}

export function login(user) {
  if (!isBrowser()) {
    return null;
  }

  const username = typeof user === "string" ? user : user.username;
  const session = {
    id: typeof user === "string" ? null : user.id,
    username: username.trim(),
    nickname: typeof user === "string" ? "" : user.nickname,
    email: typeof user === "string" ? "" : user.email,
    role: typeof user === "string" ? "CUSTOMER" : user.role,
    enabled: typeof user === "string" ? true : user.enabled,
    loginTime: new Date().toISOString()
  };

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(USER_STORAGE_KEY);
}

function readCartMap() {
  if (!isBrowser()) {
    return {};
  }

  const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);
  const parsedCart = safeParse(rawCart || "{}", {});

  return parsedCart && typeof parsedCart === "object" ? parsedCart : {};
}

function writeCartMap(cartMap) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartMap));
}

export function getCartQuantity(bookId) {
  const cartMap = readCartMap();
  return Number(cartMap[bookId]) || 0;
}

export function addToCart(bookId, amount = 1) {
  const cartMap = readCartMap();
  cartMap[bookId] = (Number(cartMap[bookId]) || 0) + Number(amount || 1);
  writeCartMap(cartMap);
  return cartMap[bookId];
}

export function setCartQuantity(bookId, quantity) {
  const cartMap = readCartMap();
  const nextQuantity = Math.max(0, Number(quantity) || 0);

  if (nextQuantity === 0) {
    delete cartMap[bookId];
  } else {
    cartMap[bookId] = nextQuantity;
  }

  writeCartMap(cartMap);
  return nextQuantity;
}

export function removeFromCart(bookId) {
  const cartMap = readCartMap();
  delete cartMap[bookId];
  writeCartMap(cartMap);
}

export function clearCart() {
  writeCartMap({});
}

export function getProfile() {
  if (!isBrowser()) {
    return DEFAULT_PROFILE;
  }

  const session = getSession();
  const rawProfile = safeParse(window.localStorage.getItem(PROFILE_STORAGE_KEY), {});

  return {
    ...DEFAULT_PROFILE,
    username: session?.username || DEFAULT_PROFILE.username,
    fullName: session?.username || DEFAULT_PROFILE.fullName,
    ...rawProfile
  };
}

export function saveProfile(profile) {
  if (!isBrowser()) {
    return profile;
  }

  const nextProfile = {
    ...getProfile(),
    ...profile
  };

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
  return nextProfile;
}

export function getCartItems() {
  const cartMap = readCartMap();

  return Object.keys(cartMap)
    .filter((bookId) => Number(cartMap[bookId]) > 0)
    .map((bookId) => {
      const book = books.find((item) => item.id === bookId);

      if (!book) {
        return null;
      }

      return {
        book,
        quantity: Number(cartMap[bookId]),
        subtotal: book.price * Number(cartMap[bookId])
      };
    })
    .filter(Boolean);
}

export function getCartSummary() {
  const items = getCartItems();

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

function formatOrderTime(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function buildCurrentOrderPreview() {
  const items = getCartItems();

  if (items.length === 0) {
    return null;
  }

  const summary = getCartSummary();
  const now = new Date();
  const dateStamp = `${now.getFullYear()}${`${now.getMonth() + 1}`.padStart(2, "0")}${`${now.getDate()}`.padStart(2, "0")}`;
  const number = `${dateStamp}${`${summary.totalCount}`.padStart(4, "0")}`;

  return {
    id: `preview-${number}`,
    number,
    time: formatOrderTime(now),
    booksText: items.map((item) => `${item.book.title} x${item.quantity}`).join("、"),
    amount: summary.totalPrice,
    amountText: formatPrice(summary.totalPrice),
    status: "pending",
    isPreview: true
  };
}
