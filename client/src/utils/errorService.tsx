import { AxiosError } from "axios";
import notification from "antd/lib/notification";

export const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    notification.error({
      message: message || error.message,
      description: "Please try again.",
    });
  } else {
    notification.error({
      message: (error as string).toString(),
      description: "Please try again.",
    });
  }
};
