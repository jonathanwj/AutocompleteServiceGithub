import GithubService from "./GithubService";
import RateLimiter from "./RateLimiter";
import { Request } from "express";

export default class GithubController {
  static async show(requestBody: Request) {
    let keywordsAndQualifiersArray: string[] | undefined;
    const keywordsAndQualifiersString: string | undefined = requestBody.query.q;
    if (keywordsAndQualifiersString) {
      keywordsAndQualifiersArray = keywordsAndQualifiersString.split("+");
    }

    const githubDTO: GithubDTO = {
      searchItem: requestBody.params.searchItem,
      keywordsAndQualifiers: keywordsAndQualifiersArray,
      sort: requestBody.query.sort,
      order: requestBody.query.order,
      repositoryID: requestBody.query.repositoryID
    };

    try {
      const results = await GithubService.searchGithubAPI(githubDTO);
      if (results.length === 0) {
        return {
          rate_limited_reached: false,
          items: results
        };
      } else {
        return {
          rate_limited_reached: false,
          items: results
        };
      }
    } catch (error) {
      if (error.message === RateLimiter.RATE_LIMIT_ERROR) {
        return { rate_limited_reached: true, items: [] };
      } else {
        throw error;
      }
    }
  }
}
