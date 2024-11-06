import { memo, useCallback } from "react";
import "./style/navbar.css";
import { handleError } from "../../utils/errorService";
import axios from "axios";
import Cookies from "universal-cookie";
import Space from "antd/lib/space";
import Avatar from "antd/lib/avatar";
import Typography from "antd/lib/typography";
import modal from "antd/lib/modal";
import UserOutlined from "@ant-design/icons/UserOutlined";
import ExclamationCircleOutlined from "@ant-design/icons/ExclamationCircleOutlined";

function UserSection() {
  const cookies = new Cookies();

  const onLogout = useCallback(async () => {
    try {
      await axios.post("/logout");
      const cookies = new Cookies();
      cookies.remove("access_token");
      cookies.remove("username");
      window.location.reload();
    } catch (error) {
      handleError(error);
    }
  }, []);

  const onConfirmLogout = useCallback(() => {
    modal.confirm({
      title: "Do you want to log out?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      cancelText: "Cancel",
      onOk: async () => {
        await onLogout();
      },
    });
  }, [onLogout]);

  return (
    <Space className="user-container" align="center" onClick={onConfirmLogout}>
      <Avatar className="avatar-user" icon={<UserOutlined />} />
      <Typography.Text className="username">
        {cookies.get("username")}
      </Typography.Text>
    </Space>
  );
}

export default memo(UserSection);
