import { memo, useCallback, useEffect, useMemo, useState } from "react";
import "./style/blogs.css";
import axios from "axios";
import Button from "antd/lib/button";
import Space from "antd/lib/space";
import Input from "antd/lib/input";
import notification from "antd/lib/notification";
import SaveOutlined from "@ant-design/icons/SaveOutlined";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { handleError } from "../../utils/errorService";
import useSWR from "swr";
import { IBlog } from "./interface/IBlog";
import Loading from "../utils/Loading";
import Error from "../utils/Error";

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    ["blockquote", "code-block"],
  ],
};

const LIMIT_TITLE = 100;
const LIMIT_CONTENT = 1000;

interface HandleBlogProps {
  action: "create" | "edit";
}

function HandleBlog({ action }: HandleBlogProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const isEdit = useMemo(() => {
    return action === "edit";
  }, [action]);

  const { data, error } = useSWR<IBlog>(id && isEdit && `/blog/${id}`);

  const initialData = useCallback(() => {
    if (data) {
      setTitle(data.title);
      setContent(data.content);
    }
  }, [data]);

  useEffect(() => {
    if (isEdit && id) {
      initialData();
    }
  }, [id, isEdit, initialData]);

  const onCancel = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onPublish = useCallback(async () => {
    setLoading(true);
    try {
      const body = {
        title,
        content,
      };

      const {
        data: { message },
      } = isEdit
        ? await axios.put(`/blog/${id}`, body)
        : await axios.post("/blog", body);

      notification.success({
        message,
      });
      setLoading(false);
      navigate("/");
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  }, [title, content, isEdit, id, navigate]);

  if (isEdit && !data && !error) return <Loading total={3} />;
  if (isEdit && error) return <Error />;

  return (
    <>
      <Space className="handle-blog-button">
        <Button disabled={loading} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={onPublish}
        >
          {isEdit ? "Save" : "Publish"}
        </Button>
      </Space>
      <div className="handle-blog-container">
        <Input
          className="input-title"
          size="large"
          placeholder="Title"
          value={title}
          disabled={loading}
          onChange={(event) => setTitle(event.target.value)}
        />
        <div className="counter">
          <span className={title.length > LIMIT_TITLE ? "counter-text" : ""}>
            {title.length}
          </span>
          /{LIMIT_TITLE}
        </div>
        <ReactQuill
          modules={modules}
          value={content}
          readOnly={loading}
          onChange={(value) => setContent(value)}
          placeholder="Tell your story..."
        />
        <div className="counter">
          <span
            className={content.length > LIMIT_CONTENT ? "counter-text" : ""}
          >
            {content.length}
          </span>
          /{LIMIT_CONTENT}
        </div>
      </div>
    </>
  );
}

export default memo(HandleBlog);
