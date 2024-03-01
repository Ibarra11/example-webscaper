import React from "react";
function App() {
  const [articles, setArticles] = React.useState([]);
  React.useEffect(() => {
    async function runEffect() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/news/turlockjournal`
      );
      if (res.ok) {
        const { articles } = await res.json();

        setArticles(articles);
      }
    }
    runEffect();
  });
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="grid grid-cols-3 gap-4 max-w-5xl w-full mx-auto">
        {articles.map((article) => (
          <article className="flex flex-col justify-between gap-4 bg-gray-600 rounded p-4 ">
            <a href={article.href} className="block text-xl text-white">
              {article.headline}
            </a>
            <a className="block" href={article.href}>
              <img
                className="rounded-md w-full aspect-square object-cover"
                src={article.img.src}
                alt={article.img.alt}
              />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

export default App;
