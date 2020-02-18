import express from "express";
import axios, { AxiosResponse } from "axios";
import cors from "cors";

const app = express();
const port = 3001;

app.get("/", async (req, res) => {
  res.send("Hello Wor;d!");
});

app.get("/search/:searchType", cors(), async (req, res) => {
  let searchType: string = req.params.searchType;
  let query: string = req.query.q;
  let sort: string = req.query.sort;
  let order: string = req.query.order;

  try {
    let githubRes = await queryGithubApi(searchType, query, sort, order);
    // console.log("success:", githubRes);
    if (githubRes.status === 200) {
      res.json(githubRes.data);
    }
  } catch (error) {
    // console.log("error:", error.response);
    res.json(error.response.data);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

async function queryGithubApi(
  searchType: string,
  query: string,
  sort?: string,
  order?: string
) {
  let fullQuery: string = "https://api.github.com/search/";
  if (searchType) fullQuery = fullQuery.concat(searchType);
  if (query) fullQuery = fullQuery.concat("?q=" + query);
  if (sort) fullQuery = fullQuery.concat("&sort=" + sort);
  if (order) fullQuery = fullQuery.concat("&order=" + order);
  return await axios.get(fullQuery);
}
