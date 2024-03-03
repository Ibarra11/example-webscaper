import { useLoaderData } from "react-router-dom";
export default function MainArticle() {
  const article = useLoaderData();
  return (
    <div className="min-h-screen bg-gray-700 py-12 px-8">
      <article className="max-w-2xl w-full mx-auto">
        <div className="mb-4">
          <img className="rounded-md" src={article.img.src} />
        </div>
        <h1 className="text-2xl text-white font-bold mb-8">
          {article.headline}
        </h1>
        <div className="space-y-4 text-gray-100">
          {article.content.map((paragraph, i) => (
            <p key={i} className="text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
