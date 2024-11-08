import { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "universal-cookie";
import Register from "./authentication/Register";
import Login from "./authentication/Login";
import NotFound from "./utils/NotFound";
import HandleBlog from "./blog/HandleBlog";
import Layout from "./layout/Layout";
import Blogs from "./blog/Blogs";
import BlogDetail from "./blog/BlogDetail";

const paths = [
  {
    path: "/",
    component: <Blogs />,
  },
  {
    path: "/new-blog",
    component: <HandleBlog action="create" />,
  },
  {
    path: "/new-blog",
    component: <HandleBlog action="create" />,
  },
  {
    path: "/edit/:id",
    component: <HandleBlog action="edit" />,
  },
  {
    path: "/blog/:id",
    component: <BlogDetail />,
  },
];

const PageRoutes = () => {
  const routes = useMemo(() => {
    const cookies = new Cookies();

    if (cookies.get("access_token")) {
      return (
        <>
          {paths.map(({ path, component }) => (
            <Route
              key={path}
              path={path}
              element={<Layout>{component}</Layout>}
            />
          ))}
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
