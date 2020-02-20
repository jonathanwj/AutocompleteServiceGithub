import express from "express";
import axios, { AxiosResponse } from "axios";
import cors from "cors";

const app = express();
const port = 3001;

let nextAllowedQueryTime: number = 0;

const TOO_MANY_REQUESTS_STATUS = 429;
// github search endpoint route
app.get("/search/:searchType", cors(), async (req, res) => {
  let searchType: string = req.params.searchType;
  let query: string = req.query.q;
  let sort: string = req.query.sort;
  let order: string = req.query.order;

  // limit number of requests send to github API
  if (currentTimeInSeconds() < nextAllowedQueryTime) {
    res.sendStatus(TOO_MANY_REQUESTS_STATUS);
    return;
  }

  try {
    let githubRes = await queryGithubApi(searchType, query, sort, order);

    let rateLimitRemaining: number = githubRes.headers["x-ratelimit-remaining"];
    let rateLimitResetTime: number = githubRes.headers["x-ratelimit-reset"];
    let currTime: number = currentTimeInSeconds();

    if (currTime >= rateLimitResetTime) {
      // reset limit has passed
      nextAllowedQueryTime = currTime;
    } else {
      // divide remaining time left by number of rateLimitRemaining
      // this prevents lockout by github API
      let secondsToNextAllowedQuery = Math.round(
        (rateLimitResetTime - currTime) / rateLimitRemaining
      );
      nextAllowedQueryTime = currTime + secondsToNextAllowedQuery;
    }
    if (githubRes.status === 200) {
      // send exact data to requestor
      res.json(githubRes.data);
    }
  } catch (error) {
    res.json(error.response.data);
  }
});

const GITHUB_API_URL = "https://api.github.com/search/";
async function queryGithubApi(
  searchType: string,
  query: string,
  sort?: string,
  order?: string
) {
  let fullQuery: string = GITHUB_API_URL;
  if (searchType) fullQuery = fullQuery.concat(searchType);
  if (query) fullQuery = fullQuery.concat("?q=" + query);
  if (sort) fullQuery = fullQuery.concat("&sort=" + sort);
  if (order) fullQuery = fullQuery.concat("&order=" + order);
  fullQuery = fullQuery.concat("&per_page=100");
  return await axios.get(fullQuery);
}

function currentTimeInSeconds() {
  return Math.round(Date.now() / 1000);
}

app.listen(port, () =>
  console.log(`AutocompleteService API listening on port ${port}!`)
);
