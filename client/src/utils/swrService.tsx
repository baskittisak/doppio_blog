import { handleError } from "./errorService";
import axios from "./axios";

export const fetcher = async (url: string) => {
  try {
    const {
      data: { data },
    } = await axios.get(url);
    return data;
  } catch (error) {
    handleError(error);
    return Promise.reject(error);
  }
};
