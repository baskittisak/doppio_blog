import { memo } from "react";
import "./style/utils.css";
import Image from "antd/lib/image";
import Space from "antd/lib/space";
import Typography from "antd/lib/typography";
import blog_logo from "../../assets/blog_logo.png";

function BlogLogo() {
  return (
    <Space align="center">
      <Image src={blog_logo} preview={false} width={48} height={48} />
      <Typography.Title level={3} className="logo-text">
        Doppio Blog
      </Typography.Title>
    </Space>
  );
}

export default memo(BlogLogo);
