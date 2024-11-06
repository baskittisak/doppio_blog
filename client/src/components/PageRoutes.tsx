import { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "universal-cookie";
import Register from "./authentication/Register";
import Login from "./authentication/Login";
import NotFound from "./utils/NotFound";
import HandleBlog from "./blog/HandleBlog";
import Layout from "./layout/Layout";
import Blogs from "./blog/Blogs";

const PageRoutes = () => {
  const routes = useMemo(() => {
    const cookies = new Cookies();

    if (cookies.get("access_token")) {
      return (
        <>
          <Route
            path="/"
            element={
              <Layout>
                <Blogs />
              </Layout>
            }
          />
          <Route
            path="/new-blog"
            element={
              <Layout>
                <HandleBlog action="create" />
              </Layout>
            }
          />
          <Route
            path="/edit"
            element={
              <Layout>
                <HandleBlog action="edit" />
              </Layout>
            }
          />
        </>
      );
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
