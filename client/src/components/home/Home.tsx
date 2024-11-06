import { memo } from "react";
import "./style/home.css";
import Navbar from "./Navbar";
import Blogs from "../blog/Blogs";

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <Blogs />
    </div>
  );
}

export default memo(Home);
