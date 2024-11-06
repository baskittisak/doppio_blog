import { memo } from "react";
import "./style/blogs.css";
import Menu from "./Menu";
import Empty from "antd/lib/empty";
import { IBlog } from "./interface/IBlog";
import useSWR from "swr";
import Loading from "../utils/Loading";
import Error from "../utils/Error";

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
    </div>
  );
}

export default memo(Blogs);
