import React from "react";
import { useLoaderData } from "react-router-dom";
function App() {
  const articles = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="grid grid-cols-3 gap-4 max-w-5xl w-full mx-auto">
        {articles.map((article) => (
          <article
            key={article.id}
            className="flex flex-col justify-between gap-4 bg-gray-600 rounded p-4 "
          >
            <a
              href={`/news/local/${article.id}`}
              className="block text-xl text-white"
            >
              {article.headline}
            </a>
            <a className="block" href={`/news/local/${article.id}`}>
              <img
                className="rounded-md w-full aspect-square object-cover"
                src={article.thumbnail.src}
                alt={article.thumbnail.alt}
              />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

export default App;
