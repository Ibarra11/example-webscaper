import express from "express";
import { scrapeNews } from "./scrapeNews.js";

const app = express();
const port = process.env.port ?? 3000;
let articles;
try {
  articles = await scrapeNews();
} catch (e) {
  process.exit(1);
}

app.get("/api/news/turlockjournal", async (req, res) => {
  try {
    return res.json({ articles });
  } catch (e) {
    return res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
