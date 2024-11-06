import { memo, useCallback, useState } from "react";
import "./style/blogs.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../utils/errorService";
import Button from "antd/lib/button";
import notification from "antd/lib/notification";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import { Modal, Space, Typography } from "antd";
import ExclamationCircleOutlined from "@ant-design/icons/ExclamationCircleOutlined";

interface DeleteBlogProps {
  id: string;
  type: "menu" | "button";
}

function DeleteBlog({ id, type }: DeleteBlogProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const onDelete = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { message },
      } = await axios.delete(`blog/${id}`);
      notification.success({
        message,
      });
      setLoading(false);
      setIsOpenModal(false);
      navigate("/");
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  }, [id, navigate]);

  return (
    <>
      {type === "button" && (
        <Button
          color="danger"
          variant="solid"
          icon={<DeleteOutlined />}
          onClick={() => setIsOpenModal(true)}
        >
          Delete
        </Button>
      )}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined />
            <Typography.Title level={5} className="detail-label">
              Do you want to delete?
            </Typography.Title>
          </Space>
        }
        centered
        closable={false}
        closeIcon={false}
        open={isOpenModal}
        width={400}
        footer={
          <Space>
            <Button disabled={loading} onClick={() => setIsOpenModal(false)}>
              Cancel
            </Button>
            <Button
              color="danger"
              variant="solid"
              loading={loading}
              onClick={onDelete}
            >
              Yes
            </Button>
          </Space>
        }
      ></Modal>
    </>
  );
}

export default memo(DeleteBlog);
