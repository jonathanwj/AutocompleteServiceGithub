import express from "express";
import axios, { AxiosResponse } from "axios";
import cors from "cors";
import GithubController from "./github/GithubController";

const app = express();
const port = 3001;

app.get("/github/search/:searchItem", cors(), async (req, res) => {
  const results = await GithubController.show(req);
  return res.json(results);
});

app.listen(port, () =>
  console.log(`AutocompleteService API listening on port ${port}!`)
);
