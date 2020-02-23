import GithubService from "./GithubService";
import RateLimiter from "./RateLimiter";

export default class GithubController {
  static async show(requestBody: any) {
    const keywordsAndQualifiersString: string = requestBody.query.q;
    const keywordsAndQualifiersArray: string[] = keywordsAndQualifiersString.split(
      "+"
    );

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
      if (error === RateLimiter.RATE_LIMIT_ERROR) {
        return { rate_limited_reached: true, items: [] };
      } else {
        throw new Error("Unable to get proper response from Github");
      }
    }
  }
}
