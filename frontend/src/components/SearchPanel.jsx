import { Card, Input, Space } from "antd";
import TopBar from "./TopBar";

const { Search } = Input;

function SearchPanel({ tag, title, description, keyword, onKeywordChange, onSearch }) {
  return (
    <Card bordered={false}>
      <Space direction="vertical" size={8} className="full-width">
        {/* 顶部说明区和搜索框拆开封装，页面里复用时会更清晰。 */}
        <TopBar tag={tag} title={title} description={description} />
        <Search
          allowClear
          placeholder="请输入书名关键词"
          enterButton="搜索"
          value={keyword}
          // onChange 负责输入过程中的实时同步。
          onChange={(event) => onKeywordChange(event.target.value)}
          // onSearch 负责点击按钮或按 Enter 时触发搜索动作。
          onSearch={onSearch}
        />
      </Space>
    </Card>
  );
}

export default SearchPanel;
