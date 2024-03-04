import express from "express";

import { readFile } from "fs/promises";
import path from "path";
import cors from "cors";
const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());

app.get("/api/news/turlockjournal", async (req, res) => {
  try {
    const articles = JSON.parse(
      await readFile(path.join(process.cwd(), "articles.json"))
    );
    return res.send(articles);
  } catch (e) {
    return res.sendStatus(500);
  }
});

app.get("/api/news/turlockjournal/:article", async (req, res) => {
  try {
    const { articles } = JSON.parse(
      await readFile(path.join(process.cwd(), "articles.json"))
    );
    const article = articles.find(
      (article) => article.id === req.params.article
    );
    if (!article) {
      return res.sendStatus(404);
    }
    return res.json({ article });
  } catch (e) {
    return res.sendStatus(500);
  }
});

app.use((req, res, next) => {
  return res.status(404).send("invalid path");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`app listening at http://localhost:${port}`);
});
