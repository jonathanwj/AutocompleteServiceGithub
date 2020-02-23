import express from "express";
import cors from "cors";
import GithubController from "./github/GithubController";

const app = express();
const port = 3001;

app.get("/github/search/:searchItem", cors(), async (req, res) => {
  try {
    const githubRes = await GithubController.show(req);
    return res.json(githubRes);
  } catch (error) {
    return res.sendStatus(500);
  }
});

app.listen(port, () =>
  console.log(`AutocompleteService API listening on port ${port}!`)
);
