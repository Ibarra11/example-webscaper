import { useLoaderData } from "react-router-dom";
import moment from "moment";
export default function MainArticle() {
  const article = useLoaderData();
  return (
    <div className="min-h-screen bg-gray-700 py-12 px-8">
      <article className="max-w-2xl w-full mx-auto">
        <div className="mb-4">
          <img className="rounded-md" src={article.img.src} />
        </div>
        <div className="mb-2 spacd-y-1 text-sm text-gray-300">
          <p>{article.author}</p>
          <p>{article.publisher}</p>
          <time>
            {moment(article.publishedDate).format("MMM D, YYYY, h:mm A")}
          </time>
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
