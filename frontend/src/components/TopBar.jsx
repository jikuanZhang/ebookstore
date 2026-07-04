import { Col, Row, Typography } from "antd";

const { Paragraph, Text, Title } = Typography;

function TopBar({ tag, title, description, actions }) {
  return (
    // TopBar 是页面公共抬头：
    // 左边放标题文案，右边留给当前页面的操作按钮。
    <Row className="topbar" justify="space-between" align="top" gutter={[16, 16]}>
      {/* 左边负责“当前页面是什么” */}
      <Col flex="auto">
        <Text className="section-tag">{tag}</Text>
        <Title level={2} className="topbar__title">
          {title}
        </Title>
        {description ? <Paragraph className="topbar__subtitle">{description}</Paragraph> : null}
      </Col>
      {/* 右边预留给页面级按钮，例如“返回列表”“查看推荐详情” */}
      <Col className="topbar__actions">{actions}</Col>
    </Row>
  );
}

export default TopBar;
