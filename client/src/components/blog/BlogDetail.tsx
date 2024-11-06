import { memo, useCallback } from "react";
import "./style/blogs.css";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import Loading from "../utils/Loading";
import Error from "../utils/Error";
import { IBlog } from "./interface/IBlog";
import Button from "antd/lib/button";
import Space from "antd/lib/space";
import Typography from "antd/lib/typography";
import EditOutlined from "@ant-design/icons/EditOutlined";
import DeleteBlog from "./DeleteBlog";

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, error } = useSWR<IBlog>(id && `/blog/${id}`);

  const onBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onEdit = useCallback(() => {
    navigate(`/edit/${id}`);
  }, [id, navigate]);

  if (!data && !error) return <Loading total={3} />;
  if (error) return <Error />;

  return (
    <div className="handle-blog-container">
      <Space className="handle-blog-button">
        <Button onClick={onBack}>Back</Button>
        {id && <DeleteBlog id={id} />}
        <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
          Edit
        </Button>
      </Space>
      {data && (
        <>
          <Typography.Title level={1}>{data?.title}</Typography.Title>
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
        </>
      )}
    </div>
  );
}

export default memo(BlogDetail);
