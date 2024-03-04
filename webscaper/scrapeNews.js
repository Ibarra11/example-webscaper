import axios from "axios";
import { readFile, writeFile } from "fs/promises";
import { load } from "cheerio";
import path from "path";

// Example Format of a article from Turlock Journal
//     <div class="anvil-content-box--style--4 anvil-content-box">
//         <a class="anvil-images__image-container" id="video-302189" href="https://www.turlockjournal.com/news/local/rain-winds-will-return-region-over-holiday-weekend/">
//             <img src="https://centralca.cdn-anvilcms.net/media/images/2024/02/14/images/Rain_pix.9b8b96f2.fill-300x200.jpg" alt="rain" class="anvil-images__background--glass">
//             <img src="https://centralca.cdn-anvilcms.net/media/images/2024/02/14/images/Rain_pix.9b8b96f2.fill-300x200.jpg" alt="rain" class="anvil-images__image anvil-images__image--shadow anvil-images__image--main-article">
//         </a>
//         <a href="https://www.turlockjournal.com/news/local/rain-winds-will-return-region-over-holiday-weekend/" class="anvil-content-box__link">
//             <div class="anvil-content-box__title anvil-padding-bottom--minor ">
//                 Rain, winds will return to region over holiday weekend
//             </div>
//         </a>
//     </div>

const SELECTOR =
  'div:has(>a[href^="https://www.turlockjournal.com/news/local/"]:not([href="https://www.turlockjournal.com/news/local/"]))';

export async function scrapeArticles() {
  try {
    const response = await axios.get(
      "https://www.turlockjournal.com/news/local"
    );
    await writeFile(path.join(process.cwd(), "articles.html"), response.data);
    const $ = load(response.data);
    const articles = [];
    $(SELECTOR).each((index, element) => {
      const article = {};
      const $ = load(element);
      const { src, alt } = $("img")[0].attribs;
      const headline = $("a:not(:has(img)) > div").text().trim();
      article.thumbnail = { src, alt };
      article.headline = headline;
      article.href = $("a")[0].attribs.href;
      const pathParts = article.href.split("/");
      const indexOfLocal = pathParts.indexOf("local");
      article.id = pathParts[indexOfLocal + 1];
      articles.push(article);
    });

    return {
      articles: await Promise.all(
        articles.map(async (article) => {
          const data = await scrapeArticle(article.href);
          return { ...article, ...data };
        })
      ),
    };
  } catch (e) {
    console.error(e);
  }
}

async function scrapeArticle(href) {
  const article = { img: { src: "" }, content: [] };
  const res = await axios.get(href);
  const $ = load(res.data);
  const body = $(".anvil-article__body p");
  const articleImg = $(".anvil-images__image-container > picture > img")[0];
  const metadata = JSON.parse($("#analytics-config").html())["page_payload"][
    "page_meta"
  ];
  article.author = metadata.author;
  article.publisher = metadata.page_publication;
  article.publishedDate = metadata.page_created_at;
  article.img.src = articleImg.attribs.src;

  body.each((index, element) => {
    const text = $(element).text().replace(/\s+/g, " ").trim();
    article.content.push(text);
  });
  return article;
}
