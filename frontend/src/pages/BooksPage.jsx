import { Alert } from "antd";
import { useEffect, useState } from "react";
import BookList from "../components/BookList";
import EmptyState from "../components/EmptyState";
import SearchPanel from "../components/SearchPanel";
import { fetchBooks, searchBooks } from "../services/api";

function BooksPage() {
  // 图书列表页只维护一个搜索关键字状态。
  // keyword 保存搜索框里的关键字，是本页面唯一的交互状态。
  const [keyword, setKeyword] = useState("");
  const [bookList, setBookList] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    fetchBooks()
      .then((remoteBooks) => {
        if (!ignore) {
          setBookList(remoteBooks);
          setLoadError("");
        }
      })
      .catch((error) => {
        if (!ignore) {
          setBookList([]);
          setLoadError(error.message || "后端接口暂时不可用。");
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSearch(value) {
    const nextKeyword = value.trim();
    setKeyword(nextKeyword);
    setLoading(true);
    try {
      const remoteBooks = nextKeyword ? await searchBooks(nextKeyword) : await fetchBooks();
      setBookList(remoteBooks);
      setLoadError("");
    } catch (error) {
      setBookList([]);
      setLoadError(error.message || "后端搜索接口暂时不可用。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="full-width">
      {/* 搜索区负责采集关键字，点击搜索后通过后端接口查询数据库。 */}
      <SearchPanel
        tag="Book List"
        title="图书列表页"
        description="书籍列表通过 Fetch API 请求 Spring Boot 后端，后端再从 MySQL 数据库读取图书数据。"
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSearch={handleSearch}
      />

      {loadError ? (
        <Alert
          style={{ marginTop: 16 }}
          type="error"
          showIcon
          message={loadError}
        />
      ) : (
        <Alert
          style={{ marginTop: 16 }}
          type="success"
          showIcon
          message={loading ? "正在从 Spring Boot 后端查询书籍..." : "当前书籍列表来自 Spring Boot 后端 API。"}
        />
      )}

      <div style={{ marginTop: 20 }}>
        {/* 有结果时展示卡片列表，没结果时展示统一空状态。 */}
        {bookList.length > 0 ? (
          <BookList books={bookList} />
        ) : (
          <EmptyState title="没有找到匹配的图书" text="可以尝试更换关键词，或者返回书籍列表重新浏览。" />
        )}
      </div>

      <p style={{ marginTop: 20, color: "#6b7280" }}>
        当前共展示 {bookList.length} 本图书，数据来源：Spring Boot + MySQL。
      </p>
    </div>
  );
}

export default BooksPage;
