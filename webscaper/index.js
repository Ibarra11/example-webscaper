import express from "express";
import { readFile } from "fs/promises";
import path from "path";
const app = express();
const port = process.env.port ?? 3000;

app.get("/api/news/turlockjournal", async (req, res) => {
  try {
    const articles = await readFile(path.join(process.cwd(), "articles.json"));
    return res.send(articles);
  } catch (e) {
    return res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
