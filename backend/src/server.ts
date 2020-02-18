import express from "express";
import axios, { AxiosResponse } from "axios";
import cors from "cors";

const app = express();
const port = 3001;

let nextAllowedQueryTime: number = 0;

app.get("/", async (req, res) => {
  res.send("Hello Wor;d!");
});

app.get("/search/:searchType", cors(), async (req, res) => {
  let searchType: string = req.params.searchType;
  let query: string = req.query.q;
  let sort: string = req.query.sort;
  let order: string = req.query.order;

  if (currentTimeInSeconds() < nextAllowedQueryTime) {
    res.sendStatus(429);
    return;
  }

  try {
    let githubRes = await queryGithubApi(searchType, query, sort, order);
    // console.log(Math.round(Date.now() / 1000));
    // console.log("success1:", githubRes.headers["x-ratelimit-limit"]);
    // console.log("success2:", githubRes.headers["x-ratelimit-remaining"]);
    // console.log("succes3:", githubRes.headers["x-ratelimit-reset"]);

    let rateLimitRemaining: number = githubRes.headers["x-ratelimit-remaining"];
    let rateLimitResetTime: number = githubRes.headers["x-ratelimit-reset"];
    let currTime: number = currentTimeInSeconds();

    if (currTime >= rateLimitResetTime) {
      nextAllowedQueryTime = currTime;
    } else {
      let secondsToNextAllowedQuery = Math.round(
        (rateLimitResetTime - currTime) / rateLimitRemaining
      );
      nextAllowedQueryTime = currTime + secondsToNextAllowedQuery;
    }
    // console.log("next allowed fimte", nextAllowedQueryTime);
    if (githubRes.status === 200) {
      res.json(githubRes.data);
    }
  } catch (error) {
    // console.log("error:", error.response.headers);
    res.json(error.response.data);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function currentTimeInSeconds() {
  return Math.round(Date.now() / 1000);
}

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
