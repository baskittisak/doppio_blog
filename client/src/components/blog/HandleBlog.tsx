import { memo } from "react";
import "./style/blogs.css";

interface HandleBlogProps {
  action: "create" | "edit";
}

function HandleBlog({ action }: HandleBlogProps) {
  return <div></div>;
}

export default memo(HandleBlog);
