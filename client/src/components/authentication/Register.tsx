import { memo, useCallback, useState } from "react";
import "./auth.css";
import axios from "axios";
import { InputStatus } from "antd/lib/_util/statusUtils";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../utils/errorService";
import Splitter from "antd/lib/splitter";
import Panel from "antd/lib/splitter/Panel";
import Image from "antd/lib/image";
import Space from "antd/lib/space";
import Typography from "antd/lib/typography";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import Flex from "antd/lib/flex";
import UserOutlined from "@ant-design/icons/UserOutlined";
import EyeTwoTone from "@ant-design/icons/EyeTwoTone";
import EyeInvisibleOutlined from "@ant-design/icons/EyeInvisibleOutlined";
import LockOutlined from "@ant-design/icons/LockOutlined";
import MailOutlined from "@ant-design/icons/MailOutlined";
import notification from "antd/lib/notification";
import blog_logo from "../../assets/blog_logo.png";
import InfoPanel from "./InfoPanel";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<{
    email?: InputStatus;
    username?: InputStatus;
    password?: InputStatus;
  }>();

  const onChangeEmail = useCallback((value: string) => {
    setEmail(value);
    setStatus((status) => ({
      ...status,
      email: !value ? "error" : "",
    }));
  }, []);

  const onChangeUserName = useCallback((value: string) => {
    setUsername(value);
    setStatus((status) => ({
      ...status,
      username: !value ? "error" : "",
    }));
  }, []);

  const onChangeUserPassword = useCallback((value: string) => {
    setPassword(value);
    setStatus((status) => ({
      ...status,
      password: !value ? "error" : "",
    }));
  }, []);

  const onRegister = useCallback(async () => {
    try {
      const {
        data: { message },
      } = await axios.post("/register", { email, username, password });
      notification.success({
        message: message,
        description: "Please log in.",
      });
      navigate("/");
    } catch (error) {
      handleError(error);
    }
  }, [email, username, password, navigate]);

  const onValidateRegister = useCallback(async () => {
    if (!email || !username || !password) {
      setStatus(() => ({
        email: !email ? "error" : "",
        username: !username ? "error" : "",
        password: !password ? "error" : "",
      }));
    }

    if (email && username && password) {
      await onRegister();
    }
  }, [email, username, password, onRegister]);

  const onGoToLogin = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="container">
      <Splitter className="splitter">
        <Panel className="panel panel-left register-panel" resizable={false}>
          <InfoPanel />
        </Panel>
        <Panel className="panel panel-right register-panel" resizable={false}>
          <div className="Register-form">
            <Space align="center">
              <Image src={blog_logo} preview={false} width={48} height={48} />
              <Typography.Title level={3} className="topic-text">
                Doppio Blog
              </Typography.Title>
            </Space>
            <Typography.Title>Create your account</Typography.Title>
            <Space size={36} className="space-container" direction="vertical">
              <Space
                className="space-container"
                direction="vertical"
                size="middle"
              >
                <Input
                  size="large"
                  placeholder="Email"
                  prefix={<MailOutlined />}
                  onChange={(event) => onChangeEmail(event.target.value)}
                  status={status?.email}
                />
                <Input
                  size="large"
                  placeholder="Username"
                  prefix={<UserOutlined />}
                  onChange={(event) => onChangeUserName(event.target.value)}
                  status={status?.username}
                />
                <Input.Password
                  size="large"
                  placeholder="Password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  prefix={<LockOutlined />}
                  onChange={(event) => onChangeUserPassword(event.target.value)}
                  status={status?.password}
                />
              </Space>
              <Button
                type="primary"
                size="large"
                block
                onClick={onValidateRegister}
              >
                Register
              </Button>
            </Space>
            <Flex justify="center" className="footer-form">
              <Typography.Text>Do you have an account?</Typography.Text>
              <Typography.Link onClick={onGoToLogin}>
                Please log in
              </Typography.Link>
            </Flex>
          </div>
        </Panel>
      </Splitter>
    </div>
  );
}

export default memo(Register);
