import { memo } from "react";
import "./style/layout.css";
import Navbar from "./Navbar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout-container">
      <Navbar />
      {children}
    </div>
  );
}

export default memo(Layout);
