import { Button, Form, Input, InputNumber, message, Modal, Space, Table } from "antd";
import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { createBook, deleteBook, fetchBooks, updateBook } from "../services/api";
import { getSession } from "../utils/store";

function toFormValues(book) {
  return {
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    isbn: book.isbn,
    price: book.price,
    stock: book.stockCount,
    cover: book.cover,
    category: book.category,
    description: book.description,
    intro: book.intro,
    audience: book.audience,
    reason: book.reason
  };
}

function AdminBooksPage() {
  const session = getSession();
  const [books, setBooks] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  async function loadBooks() {
    try {
      const remoteBooks = await fetchBooks();
      setBooks(remoteBooks);
    } catch (error) {
      message.error(error.message || "图书列表加载失败。");
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  function openCreateModal() {
    setEditingBook(null);
    form.resetFields();
    form.setFieldsValue({
      cover: "/assets/images/book-1.svg",
      category: "综合图书",
      price: 0,
      stock: 0
    });
    setModalOpen(true);
  }

  function openEditModal(book) {
    setEditingBook(book);
    form.setFieldsValue(toFormValues(book));
    setModalOpen(true);
  }

  async function handleSave() {
    try {
      const values = await form.validateFields();
      if (editingBook) {
        await updateBook(session.id, editingBook.backendId, values);
        message.success("图书信息已更新。");
      } else {
        await createBook(session.id, values);
        message.success("新图书已添加。");
      }
      setModalOpen(false);
      loadBooks();
    } catch (error) {
      if (error.errorFields) {
        return;
      }
      message.error(error.message || "保存图书失败。");
    }
  }

  async function handleDelete(book) {
    try {
      await deleteBook(session.id, book.backendId);
      message.success("图书已删除。");
      loadBooks();
    } catch (error) {
      message.error(error.message || "删除图书失败。");
    }
  }

  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(keyword.trim().toLowerCase()));

  const columns = [
    {
      title: "封面",
      dataIndex: "cover",
      render: (cover, book) => <img src={cover} alt={book.title} className="table-book-cover" />
    },
    { title: "书名", dataIndex: "title" },
    { title: "作者", dataIndex: "author" },
    { title: "ISBN", dataIndex: "isbn" },
    { title: "库存", dataIndex: "stockCount" },
    { title: "价格", dataIndex: "priceText" },
    {
      title: "操作",
      render: (_, book) => (
        <Space>
          <Button onClick={() => openEditModal(book)}>编辑</Button>
          <Button danger onClick={() => handleDelete(book)}>删除</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="full-width">
      <TopBar
        tag="Admin"
        title="书籍管理"
        description="管理员可以搜索、添加、修改和删除数据库中的图书。"
        actions={<Button type="primary" onClick={openCreateModal}>添加图书</Button>}
      />
      <Input.Search
        placeholder="按书名搜索"
        allowClear
        onSearch={setKeyword}
        onChange={(event) => setKeyword(event.target.value)}
        style={{ marginTop: 20, maxWidth: 360 }}
      />
      <div style={{ marginTop: 20 }}>
        <Table rowKey="backendId" columns={columns} dataSource={filteredBooks} />
      </div>

      <Modal
        title={editingBook ? "编辑图书" : "添加图书"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText="保存"
        cancelText="取消"
        width={760}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="书名" name="title" rules={[{ required: true, message: "请输入书名" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="作者" name="author" rules={[{ required: true, message: "请输入作者" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="ISBN" name="isbn" rules={[{ required: true, message: "请输入 ISBN" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="出版社" name="publisher">
            <Input />
          </Form.Item>
          <Form.Item label="封面路径" name="cover">
            <Input />
          </Form.Item>
          <Space size={16} align="start">
            <Form.Item label="定价" name="price" rules={[{ required: true, message: "请输入定价" }]}>
              <InputNumber min={0} precision={2} />
            </Form.Item>
            <Form.Item label="库存" name="stock" rules={[{ required: true, message: "请输入库存" }]}>
              <InputNumber min={0} precision={0} />
            </Form.Item>
            <Form.Item label="分类" name="category">
              <Input />
            </Form.Item>
          </Space>
          <Form.Item label="简介" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="内容简介" name="intro">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="适合人群" name="audience">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="推荐理由" name="reason">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminBooksPage;
