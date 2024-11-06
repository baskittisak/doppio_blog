import { memo, useCallback, useState } from "react";
import "./style/blogs.css";
import axios from "axios";
import { KeyedMutator } from "swr";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../utils/errorService";
import Button from "antd/lib/button";
import Modal from "antd/lib/modal";
import Space from "antd/lib/space";
import Typography from "antd/lib/typography";
import notification from "antd/lib/notification";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import ExclamationCircleOutlined from "@ant-design/icons/ExclamationCircleOutlined";
import { IBlog } from "./interface/IBlog";

interface DeleteBlogProps {
  id: string;
  type: "menu" | "button";
  mutate?: KeyedMutator<IBlog[]>;
}

function DeleteBlog({ id, type, mutate }: DeleteBlogProps) {
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
      mutate && mutate();
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  }, [id, mutate, navigate]);

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
      {type === "menu" && (
        <Space onClick={() => setIsOpenModal(true)}>
          <DeleteOutlined />
          <div>Delete</div>
        </Space>
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
