import { memo } from "react";
import Empty from "antd/lib/empty";
import WarningOutlined from "@ant-design/icons/WarningOutlined";

interface ErrorProps {
  description?: string;
}

function Error({
  description = "Oops! Something went wrong. Please try again or refresh the page.",
}: ErrorProps) {
  return (
    <Empty
      className="empty-blog"
      image={<WarningOutlined />}
      imageStyle={{ fontSize: 68, color: "rgba(0, 0, 0, 0.45)" }}
      description={description}
    />
  );
}

export default memo(Error);
