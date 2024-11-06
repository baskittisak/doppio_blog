import { memo, useCallback, useState } from "react";
import "./auth.css";
import axios from "axios";
import Cookies from "universal-cookie";
import { InputStatus } from "antd/lib/_util/statusUtils";
import { useNavigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { handleError } from "../../utils/errorService";
import Splitter from "antd/lib/splitter";
import Panel from "antd/lib/splitter/Panel";
import Image from "antd/lib/image";
import Space from "antd/lib/space";
import Typography from "antd/lib/typography";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import Flex from "antd/lib/flex";
import notification from "antd/lib/notification";
import UserOutlined from "@ant-design/icons/UserOutlined";
import EyeTwoTone from "@ant-design/icons/EyeTwoTone";
import EyeInvisibleOutlined from "@ant-design/icons/EyeInvisibleOutlined";
import LockOutlined from "@ant-design/icons/LockOutlined";
import blog_logo from "../../assets/blog_logo.png";
import InfoPanel from "./InfoPanel";

interface CustomJwtPayload extends JwtPayload {
  username: string;
  email: string;
}

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<{
    username?: InputStatus;
    password?: InputStatus;
  }>();

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

  const onLogin = useCallback(async () => {
    try {
      const {
        data: { data: token, message },
      } = await axios.post("/login", { username, password });
      const cookies = new Cookies();
      cookies.set("access_token", token);
      const decoded = jwtDecode(token) as CustomJwtPayload;
      cookies.set("username", decoded.username);
      notification.success({
        message: message,
      });
      setTimeout(() => {
        navigate(0);
      }, 500);
    } catch (error) {
      handleError(error);
    }
  }, [username, password, navigate]);

  const onValidateLogin = useCallback(async () => {
    if (!username || !password) {
      setStatus(() => ({
        username: !username ? "error" : "",
        password: !password ? "error" : "",
      }));
    }

    if (username && password) {
      await onLogin();
    }
  }, [username, password, onLogin]);

  const onGoToRegister = useCallback(() => {
    navigate("/register");
  }, [navigate]);

  return (
    <div className="container">
      <Splitter className="splitter">
        <Panel className="panel panel-left" resizable={false}>
          <div className="login-form">
            <Space align="center">
              <Image src={blog_logo} preview={false} width={48} height={48} />
              <Typography.Title level={3} className="topic-text">
                Doppio Blog
              </Typography.Title>
            </Space>
            <Typography.Title>Log in to your account</Typography.Title>
            <Space size={36} className="space-container" direction="vertical">
              <Space
                className="space-container"
                direction="vertical"
                size="middle"
              >
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
                onClick={onValidateLogin}
              >
                Log in
              </Button>
            </Space>
            <Flex justify="center" className="footer-form">
              <Typography.Text>Don't have an account?</Typography.Text>
              <Typography.Link onClick={onGoToRegister}>
                Create an account
              </Typography.Link>
            </Flex>
          </div>
        </Panel>
        <Panel className="panel panel-right info-panel" resizable={false}>
          <InfoPanel />
        </Panel>
      </Splitter>
    </div>
  );
}

export default memo(Login);
