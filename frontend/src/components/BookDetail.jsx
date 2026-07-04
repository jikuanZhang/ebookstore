import { Button, Card, Col, Descriptions, Row, Space, Tag, Typography } from "antd";
import { Link } from "react-router-dom";

const { Paragraph, Text, Title } = Typography;

function BookDetail({ book, relatedBooks, cartQuantity, canPurchase, onAddToCart, onBuyNow, onBackToList }) {
  return (
    <Space direction="vertical" size={24} className="full-width">
      {/* 详情主体：
          这一块集中展示当前图书的封面、价格、库存和操作按钮。 */}
      {/* 上半部分是详情页核心信息：
          左边放封面，右边放标题、作者、价格、简介等内容。 */}
      <Card className="detail-card" bordered={false}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={10}>
            <figure className="detail-card__figure">
              <img className="detail-card__cover" src={book.cover} alt={`${book.title}封面`} />
            </figure>
          </Col>
          <Col xs={24} md={14}>
            <Space direction="vertical" size={16} className="detail-card__content">
              <Tag color="cyan" className="detail-card__category">
                {book.category}
              </Tag>
              <Title level={2} className="detail-card__title">
                {book.title}
              </Title>
              <Text className="detail-card__meta">
                作者：{book.author} ｜ 出版社：{book.publisher} ｜ ISBN：{book.isbn} ｜ 库存：{book.stock}
              </Text>
              <Text strong className="detail-card__price">
                {book.priceText}
              </Text>
              <Paragraph className="detail-card__desc">{book.description}</Paragraph>

              <Descriptions bordered size="small" column={1}>
                {/* Descriptions 适合展示“标签 + 值”的静态说明信息。 */}
                <Descriptions.Item label="出版社">{book.publisher}</Descriptions.Item>
                <Descriptions.Item label="ISBN">{book.isbn}</Descriptions.Item>
                <Descriptions.Item label="库存状态">{book.stock}</Descriptions.Item>
                {canPurchase ? (
                  <Descriptions.Item label="当前购物车数量">{cartQuantity} 本</Descriptions.Item>
                ) : (
                  <Descriptions.Item label="当前模式">管理员浏览</Descriptions.Item>
                )}
              </Descriptions>

              <Space wrap className="detail-actions">
                {/* 按钮本身不处理数据，真正的业务逻辑由父页面通过 props 传进来。 */}
                {canPurchase ? (
                  <>
                    <Button type="primary" onClick={onAddToCart}>
                      加入购物车
                    </Button>
                    <Button onClick={onBuyNow}>直接购买</Button>
                  </>
                ) : null}
                <Button onClick={onBackToList}>返回列表</Button>
              </Space>

              {/* 下面三个信息块本质上是把不同内容分栏展示，
                  比把所有文字挤在一段里更清晰，也更容易解释组件设计。 */}
              <Row gutter={[16, 16]} className="detail-info">
                <Col xs={24} md={8}>
                  <Card className="info-block" size="small">
                    <Title level={4} className="info-block__title">
                      内容简介
                    </Title>
                    <Paragraph className="info-block__text">{book.intro}</Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card className="info-block" size="small">
                    <Title level={4} className="info-block__title">
                      适合人群
                    </Title>
                    <Paragraph className="info-block__text">{book.audience}</Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card className="info-block" size="small">
                    <Title level={4} className="info-block__title">
                      推荐理由
                    </Title>
                    <Paragraph className="info-block__text">{book.reason}</Paragraph>
                  </Card>
                </Col>
              </Row>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 下半部分是相关推荐。
          这里继续复用 Link 跳转，同时也把 relatedBook 通过 state 传过去。 */}
      <Card
        className="related-section"
        id="relatedBooks"
        title="相关推荐"
        extra={<Link to="/books">返回书籍列表</Link>}
        bordered={false}
      >
        <Row gutter={[16, 16]}>
          {relatedBooks.map((relatedBook) => (
            // 这里直接用栅格列控制每行显示数量，布局会比 List grid 更直观稳定。
            <Col key={relatedBook.id} xs={24} sm={12} lg={8}>
              <Card className="mini-book" hoverable>
                <Link to={`/books/${relatedBook.id}`} state={{ book: relatedBook }} className="mini-book__link">
                  <div className="mini-book__media">
                    <img
                      className="mini-book__image"
                      src={relatedBook.cover}
                      alt={relatedBook.title}
                    />
                  </div>
                  <Title level={5} className="mini-book__title">
                    {relatedBook.title}
                  </Title>
                  <Text strong className="mini-book__price">
                    {relatedBook.priceText}
                  </Text>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </Space>
  );
}

export default BookDetail;
