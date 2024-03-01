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

export async function scrapeNews() {
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
        const img = { src: "", alt: "" };
        const { src, alt } = $("img")[0].attribs;
        img.src = src;
        img.alt = alt;
        articles[href] = { img };
      }
    });
    $(`${SELECTOR}:not(:has(img))`).each((index, element) => {
      const $ = load(element);
      const href = element.attribs.href;
      const article = articles[href];
      if (article && !("headline" in article)) {
        article.headline = $("div").text().trim();
        article.href = href;
      }
    });
    return Object.values(articles);
  } catch (e) {
    console.error(e);
  }
}
