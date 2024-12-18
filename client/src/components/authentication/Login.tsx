import { memo, useCallback, useState } from "react";
import "./style/auth.css";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { handleError } from "../../utils/errorService";
import Splitter from "antd/lib/splitter";
import Panel from "antd/lib/splitter/Panel";
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
import InfoPanel from "./InfoPanel";
import BlogLogo from "../utils/BlogLogo";

interface CustomJwtPayload extends JwtPayload {
  username: string;
  email: string;
}

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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

  const onGoToRegister = useCallback(() => {
    navigate("/register");
  }, [navigate]);

  return (
    <div className="container">
      <Splitter className="splitter">
        <Panel className="panel panel-left" resizable={false}>
          <div className="login-form">
            <BlogLogo />
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
                  onChange={(event) => setUsername(event.target.value)}
                />
                <Input.Password
                  size="large"
                  placeholder="Password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  prefix={<LockOutlined />}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Space>
              <Button
                type="primary"
                size="large"
                block
                disabled={!username || !password}
                onClick={onLogin}
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
