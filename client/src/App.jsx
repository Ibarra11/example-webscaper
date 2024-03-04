import React from "react";
import { useLoaderData } from "react-router-dom";
import PreviewArticle from "./PreviewArticle";
function App() {
  const articles = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="grid grid-cols-3 gap-4 max-w-5xl w-full mx-auto">
        {articles.map((article) => (
          <PreviewArticle
            id={article.id}
            thumbnail={article.thumbnail}
            headline={article.headline}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
