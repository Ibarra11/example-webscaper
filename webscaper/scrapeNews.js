import axios from "axios";
import { load } from "cheerio";

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
  'a[href^="https://www.turlockjournal.com/news/local/"]:not([href="https://www.turlockjournal.com/news/local/"])';

export async function scrapeArticles() {
  try {
    const response = await axios.get(
      "https://www.turlockjournal.com/news/local"
    );
    const $ = load(response.data);
    const articles = {};
    $(`${SELECTOR}:has(img)`).each((index, element) => {
      const $ = load(element);
      const href = element.attribs.href;
      if (!(href in articles)) {
        const thumbnail = { src: "", alt: "" };
        const { src, alt } = $("img")[0].attribs;
        thumbnail.src = src;
        thumbnail.alt = alt;
        articles[href] = { thumbnail };
      }
    });

    $(`${SELECTOR}:not(:has(img))`).each((index, element) => {
      const $ = load(element);
      const href = element.attribs.href;
      const article = articles[href];
      if (article && !("headline" in article)) {
        article.headline = $("div").text().trim();
        article.href = href;
        const pathParts = href.split("/");
        const indexOfLocal = pathParts.indexOf("local");
        article.id = pathParts[indexOfLocal + 1];
      }
    });

    return {
      articles: await Promise.all(
        Object.values(articles).map(async (article) => {
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
