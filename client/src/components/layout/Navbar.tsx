import { memo } from "react";
import "./style/navbar.css";
import BlogLogo from "../utils/BlogLogo";
import UserSection from "./UserSection";

function Navbar() {
  return (
    <div className="navbar-container">
      <BlogLogo />
      <UserSection />
    </div>
  );
}

export default memo(Navbar);
