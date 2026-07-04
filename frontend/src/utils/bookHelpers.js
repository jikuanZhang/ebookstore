import booksData from "../data/books.json";

// 统一导出图书数据。
// 页面和组件都从这里取数据，避免每个文件都直接读 JSON，方便后续集中维护。
export const books = booksData;

// 根据图书 id 查找单本图书。
// 详情页刷新时，location.state 会丢失，所以需要靠 id 从本地数据重新查。
export function getBookById(id, sourceBooks = books) {
  return sourceBooks.find((book) => book.id === id) || null;
}

// 获取相关推荐。
// 这里的策略比较简单：把当前图书过滤掉，再取前 count 本。
// 对课程作业来说已经足够清晰，也方便讲解。
export function getRelatedBooks(currentId, count = 3, sourceBooks = books) {
  return sourceBooks.filter((book) => book.id !== currentId).slice(0, count);
}

// 列表页搜索逻辑：
// 把标题、作者、分类、出版社、简介拼成一个字符串，
// 只要关键词出现在其中任意位置，就认为匹配成功。
export function filterBooks(keyword, sourceBooks = books) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  // 没有有效搜索词, 不作筛选
  if (!normalizedKeyword) {
    return sourceBooks;
  }

  return sourceBooks.filter((book) => {

    // 搜索信息, 字符串, 拼接, 在里面寻找关键词, 有就符合filter标准会被过滤
    const searchText = [
      book.title,
      book.author,
      book.category,
      book.publisher,
      book.description
    ]
      .join(" ")
      .toLowerCase();

    return searchText.includes(normalizedKeyword);
  });
}
