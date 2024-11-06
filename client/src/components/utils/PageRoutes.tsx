import { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "universal-cookie";
import Register from ".././authentication/Register";
import Login from ".././authentication/Login";
import NotFound from "./NotFound";

const PageRoutes = () => {
  const routes = useMemo(() => {
    const cookies = new Cookies();

    if (cookies.get("access_token")) {
      return <Route path="/" element={<div>Hello Doppio</div>} />;
    } else {
      return (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </>
      );
    }
  }, []);

  return (
    <Router>
      <Routes>
        {routes}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default PageRoutes;
