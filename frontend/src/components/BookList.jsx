import { Col, Row } from "antd";
import BookCard from "./BookCard";

function BookList({ books }) {
  return (
    // BookList 只负责“遍历数据并渲染多个 BookCard”，
    // 不负责搜索和数据来源，这样职责会更单一。
    <Row gutter={[16, 16]} className="book-grid" aria-label="书籍列表">
      {books.map((book) => (
        // 每一本书交给一个 BookCard；栅格参数控制不同屏幕宽度下每行显示多少列。
        <Col key={book.id} xs={24} sm={12} xl={8}>
          <BookCard book={book} />
        </Col>
      ))}
    </Row>
  );
}

export default BookList;
