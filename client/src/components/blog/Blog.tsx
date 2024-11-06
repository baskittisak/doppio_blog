import { memo, useCallback } from "react";
import "./style/blogs.css";
import Card from "antd/lib/card";
import { IBlog } from "./interface/IBlog";
import { useNavigate } from "react-router-dom";

function Blog({ id, title, content }: IBlog) {
  const navigate = useNavigate();

  const onViewDetail = useCallback(() => {
    navigate(`/blog/${id}`);
  }, [id, navigate]);

  return (
    <Card
      className="blog-container"
      title={title}
      bordered={false}
      hoverable
      onClick={onViewDetail}
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Card>
  );
}

export default memo(Blog);
