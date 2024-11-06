import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Result from "antd/lib/result";
import Button from "antd/lib/button";

function NotFound() {
  const navigate = useNavigate();

  const onBackHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={onBackHome}>
          Back Home
        </Button>
      }
    />
  );
}

export default memo(NotFound);
