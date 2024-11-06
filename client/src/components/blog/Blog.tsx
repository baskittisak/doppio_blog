import { memo } from "react";
import "./style/blogs.css";
import Card from "antd/lib/card";
import { IBlog } from "./interface/IBlog";

function Blog({ title, content }: IBlog) {
  return (
    <Card className="blog-container" title={title} bordered={false} hoverable>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Card>
  );
}

export default memo(Blog);
