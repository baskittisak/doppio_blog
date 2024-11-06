import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const BASE_URL = `${process.env.REACT_APP_API_URL}`;
const access_token = cookies.get("access_token");

if (access_token) {
  const token = `Bearer ${access_token}`;
  axios.defaults.headers.common["authorization"] = token;
}

axios.defaults.baseURL = BASE_URL;
export default axios;
