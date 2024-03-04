export default function PreviewArticle({ id, thumbnail, headline }) {
  return (
    <article
      key={id}
      className="flex flex-col justify-between gap-4 bg-gray-600 rounded p-4 "
    >
      <a href={`/news/local/${id}`} className="block text-xl text-white">
        {headline}
      </a>
      <a className="block" href={`/news/local/${id}`}>
        <img
          className="rounded-md w-full aspect-square object-cover"
          src={thumbnail.src}
          alt={thumbnail.alt}
        />
      </a>
    </article>
  );
}
