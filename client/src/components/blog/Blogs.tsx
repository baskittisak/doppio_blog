import { memo } from "react";
import Menu from "./Menu";

function Blogs() {
  return (
    <div className="blogs-container">
      <Menu />
    </div>
  );
}

export default memo(Blogs);
