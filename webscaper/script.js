import { scrapeArticles } from "./scrapeNews.js";
import { writeFile } from "fs/promises";
import path from "path";

async function main() {
  const articles = await scrapeArticles();

  await writeFile(
    path.join(process.cwd(), "articles.json"),
    JSON.stringify(articles)
  );
}

try {
  await main();
} catch (e) {
  process.exit(1);
}
