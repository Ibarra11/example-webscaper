import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import MainArticle from "./MainArticle.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/news/turlockjournal`
      );
      if (res.ok) {
        const { articles } = await res.json();
        return articles;
      }
      return [];
    },
  },
  {
    path: "/news/local/:article",
    element: <MainArticle />,
    loader: async ({ params }) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/news/turlockjournal/${params.article}`
      );
      if (res.ok) {
        const { article } = await res.json();
        return article;
      }
      return redirect("/");
    },
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
