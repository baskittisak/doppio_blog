import { memo } from "react";
import "./style/blogs.css";
import Card from "antd/lib/card";
import { IBlog } from "./interface/IBlog";

function Blog({ id, title, content }: IBlog) {
  return (
    <Card className="blog-container" title={title} bordered={false} hoverable>
      {content}
    </Card>
  );
}

export default memo(Blog);
