import { memo } from "react";
import "./style/blogs.css";
import Menu from "./Menu";
import Empty from "antd/lib/empty";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { IBlog } from "./interface/IBlog";
import useSWR from "swr";
import Loading from "../utils/Loading";
import Error from "../utils/Error";
import Blog from "./Blog";

function Blogs() {
  const { data, error } = useSWR<IBlog[]>("/blogs");

  if (!data && !error) return <Loading total={3} />;
  if (error) return <Error />;

  return (
    <div className="blogs-container">
      <Menu />
      {data && !data.length && (
        <Empty
          className="empty-blog"
          description="There's no blog post yet. Start by creating your first post and share your amazing ideas with the world!"
        />
      )}
      {data && data.length && (
        <Row gutter={[24, 24]}>
          {data.map((blog) => (
            <Col key={blog.id} xs={24} sm={24} md={12} lg={8}>
              <Blog {...blog} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default memo(Blogs);
