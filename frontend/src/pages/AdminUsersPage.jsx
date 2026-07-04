import { message, Switch, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { fetchUsers, updateUserStatus } from "../services/api";
import { getSession } from "../utils/store";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const session = getSession();

  async function loadUsers() {
    try {
      setUsers(await fetchUsers(session.id));
    } catch (error) {
      message.error(error.message || "用户列表加载失败。");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleStatusChange(user, enabled) {
    try {
      const nextUser = await updateUserStatus(session.id, user.id, enabled);
      setUsers((items) => items.map((item) => (item.id === nextUser.id ? nextUser : item)));
      message.success(enabled ? "用户已解禁。" : "用户已禁用。");
    } catch (error) {
      message.error(error.message || "用户状态更新失败。");
    }
  }

  const columns = [
    { title: "用户名", dataIndex: "username" },
    { title: "昵称", dataIndex: "nickname" },
    { title: "邮箱", dataIndex: "email" },
    {
      title: "角色",
      dataIndex: "role",
      render: (role) => <Tag color={role === "ADMIN" ? "red" : "blue"}>{role === "ADMIN" ? "管理员" : "顾客"}</Tag>
    },
    {
      title: "状态",
      dataIndex: "enabled",
      render: (enabled) => <Tag color={enabled ? "success" : "default"}>{enabled ? "正常" : "已禁用"}</Tag>
    },
    {
      title: "操作",
      render: (_, user) => (
        <Switch
          checked={user.enabled}
          disabled={user.role === "ADMIN"}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          onChange={(enabled) => handleStatusChange(user, enabled)}
        />
      )
    }
  ];

  return (
    <div className="full-width">
      <TopBar tag="Admin" title="用户管理" description="管理员可以禁用或解禁普通顾客账号，被禁用用户无法登录系统。" />
      <div style={{ marginTop: 20 }}>
        <Table rowKey="id" columns={columns} dataSource={users} pagination={false} />
      </div>
    </div>
  );
}

export default AdminUsersPage;
