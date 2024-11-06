import { memo } from "react";
import "./style/blogs.css";
import Menu from "./Menu";
import Empty from "antd/lib/empty";

function Blogs() {
  return (
    <div className="blogs-container">
      <Menu />
      <Empty
        className="empty-blog"
        description="There's no blog post yet. Start by creating your first post and share your amazing ideas with the world!"
      />
    </div>
  );
}

export default memo(Blogs);
