import { memo, useCallback } from "react";
import "./style/menu.css";
import Tabs from "antd/lib/tabs";
import Button from "antd/lib/button";
import { type TabsProps } from "antd";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { useNavigate } from "react-router-dom";

const menus: TabsProps["items"] = [
  {
    key: "1",
    label: "Your blog",
  },
  {
    key: "2",
    label: "Draft",
    disabled: true,
  },
];

function Menu() {
  const navigate = useNavigate();

  const onCreate = useCallback(() => {
    navigate("/new-blog");
  }, [navigate]);

  return (
    <div className="menu-container">
      <Tabs className="tab-container" defaultActiveKey="1" items={menus} />
      <Button type="primary" icon={<EditOutlined />} onClick={onCreate}>
        Write Blog
      </Button>
    </div>
  );
}

export default memo(Menu);
