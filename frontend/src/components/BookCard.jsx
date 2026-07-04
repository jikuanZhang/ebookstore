import { Button, Card, Space, Tag, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { getSession } from "../utils/store";

const { Paragraph, Text, Title } = Typography;

function BookCard({ book }) {
  // 这里接收的是“单本图书对象”，BookList 会负责把多本书逐个传进来。
  const navigate = useNavigate();
  const session = getSession();
  const isAdmin = session?.role === "ADMIN";
  const actions = [
    <Link key="detail-link" to={`/books/${book.id}`} state={{ book }}>
      查看详情
    </Link>
  ];

  if (!isAdmin) {
    actions.push(
      <Link key="cart-link" to="/cart">
        前往购物车
      </Link>
    );
  }

  return (
    <Card
      hoverable
      className="book-card"
      // Card 的 cover 用来放顶部大图，视觉上就是一张书籍封面卡片。
      cover={
        <figure className="book-card__figure">
          <img className="book-card__image" src={book.cover} alt={book.title} />
        </figure>
      }
      actions={actions}
    >
      {/* 图书文字信息区域 */}
      <Space direction="vertical" size={12} className="book-card__body">
        <Tag color="geekblue" className="book-card__category">
          {book.category}
        </Tag>
        <Title level={4} className="book-card__title">
          {book.title}
        </Title>
        <Text className="book-card__author">作者：{book.author}</Text>
        <Text type="secondary">出版社：{book.publisher}</Text>
        <Paragraph className="book-card__desc">{book.description}</Paragraph>
        <div className="book-card__footer">
          <Text strong className="price-text">
            {book.priceText}
          </Text>
          <Button type="primary" onClick={() => navigate(`/books/${book.id}`, { state: { book } })}>
            {/* 这里除了跳转到 /books/:id，还把当前图书对象一起塞进 state。
                好处是进入详情页时可以直接拿到对象，不必先按 id 再查一次。 */}
            进入详情
          </Button>
        </div>
      </Space>
    </Card>
  );
}

export default BookCard;
