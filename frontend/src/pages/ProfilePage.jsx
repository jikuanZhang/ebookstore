import { useState } from "react";
import { Form, message } from "antd";
import ProfileFormCard from "../components/ProfileFormCard";
import ProfileHeader from "../components/ProfileHeader";
import { getProfile, saveProfile } from "../utils/store";

function ProfilePage() {
  // 页面持有表单实例，是为了在保存/重置时主动控制表单显示值。
  const [form] = Form.useForm();

  // 页面初始数据来自 store 中保存的本地用户资料。
  const [profile, setProfile] = useState(getProfile());

  function handleFinish(values) {
    // 保存成功后，同时更新本页 state 和表单值，确保界面显示的是最新资料。
    const nextProfile = saveProfile(values);
    setProfile(nextProfile);
    form.setFieldsValue(nextProfile);
    message.success("个人信息已保存。");
  }

  function handleReset() {
    // 这里不是恢复“最初默认值”，而是恢复“当前已经保存过的资料”。
    form.setFieldsValue(profile);
    message.info("已恢复到当前保存的本地信息。");
  }

  return (
    <div className="full-width">
      {/* 头部显示当前用户概览，下方表单负责编辑详细资料。 */}
      <ProfileHeader username={profile.username} />
      <div style={{ marginTop: 20 }}>
        <ProfileFormCard form={form} profile={profile} onFinish={handleFinish} onReset={handleReset} />
      </div>
    </div>
  );
}

export default ProfilePage;
