import { memo } from "react";
import "./style/home.css";
import Navbar from "./Navbar";

function Home() {
  return (
    <div className="home-container">
      <Navbar />
    </div>
  );
}

export default memo(Home);
