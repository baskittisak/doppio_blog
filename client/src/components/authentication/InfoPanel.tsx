import { memo } from "react";
import "./style/auth.css";
import Image from "antd/lib/image";
import Space from "antd/lib/space";
import Typography from "antd/lib/typography";
import blog_logo from "../../assets/blog_logo.png";

export const InfoText = memo(() => {
  return (
    <Space size={0} direction="vertical">
      <Typography.Title level={3} className="info-text">
        Blogging is not just a hobby
      </Typography.Title>
      <Typography.Text className="info-text">
        it's a way to share your voice with the world.
      </Typography.Text>
    </Space>
  );
});

function InfoPanel() {
  return (
    <Space className="space-container info-onboard" direction="vertical">
      <Image className="img-info" src={blog_logo} preview={false} />
      <InfoText />
    </Space>
  );
}

export default memo(InfoPanel);
