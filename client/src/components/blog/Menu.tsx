import { memo } from "react";
import "./style/menu.css";
import Tabs from "antd/lib/tabs";
import Button from "antd/lib/button";
import { type TabsProps } from "antd";
import EditOutlined from "@ant-design/icons/EditOutlined";

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
  return (
    <div className="menu-container">
      <Tabs className="tab-container" defaultActiveKey="1" items={menus} />
      <Button type="primary" icon={<EditOutlined />}>Write Blog</Button>
    </div>
  );
}

export default memo(Menu);
