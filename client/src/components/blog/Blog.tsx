import { memo, useCallback, useMemo } from "react";
import "./style/blogs.css";
import { KeyedMutator } from "swr";
import Card from "antd/lib/card";
import Space from "antd/lib/space";
import { IBlog } from "./interface/IBlog";
import { useNavigate } from "react-router-dom";
import EditOutlined from "@ant-design/icons/EditOutlined";
import EyeOutlined from "@ant-design/icons/EyeOutlined";
import DeleteBlog from "./DeleteBlog";

interface BlogProps extends IBlog {
  mutate: KeyedMutator<IBlog[]>;
}

function Blog({ id, title, content, mutate }: BlogProps) {
  const navigate = useNavigate();

  const onViewDetail = useCallback(() => {
    navigate(`/blog/${id}`);
  }, [id, navigate]);

  const onEdit = useCallback(() => {
    navigate(`/edit/${id}`);
  }, [id, navigate]);

  const actions = useMemo(
    () => [
      <Space key="view" onClick={onViewDetail}>
        <EyeOutlined />
        <div>View</div>
      </Space>,
      <Space key="view" onClick={onEdit}>
        <EditOutlined key="edit" />
        <div>Edit</div>
      </Space>,
      id && <DeleteBlog key="delete" id={id} type="menu" mutate={mutate} />,
    ],
    [id, onViewDetail, onEdit, mutate]
  );

  return (
    <Card
      className="blog-container"
      title={title}
      bordered={false}
      hoverable
      actions={actions}
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Card>
  );
}

export default memo(Blog);
