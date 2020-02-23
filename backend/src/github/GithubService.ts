import Axios, { AxiosResponse, AxiosError } from "axios";
import GithubQueryStringBuilder from "./GithubQueryStringBuilder";
import { isArrayOfItems } from "./utils";
import RateLimiter from "./RateLimiter";

const GITHUB_API_URL = "https://api.github.com/search/";

const REPOSITORIES = "repositories";
const COMMITS = "commits";
const CODE = "code";
const ISSUES = "issues";
const USERS = "users";
const TOPICS = "topics";
const LABELS = "labels";

const RATE_LIMIT_REMAINING_HEADER = "x-ratelimit-remaining";
const RATE_LIMIT_RESET_HEADER = "x-ratelimit-reset";

export default class GithubService {
  static async searchGithubAPI(dto: GithubDTO): Promise<object[]> {
    if (!dto.keywordsAndQualifiers) {
      throw new Error("Missing keywordsAndQualifiers");
    }
    switch (dto.searchItem) {
      case REPOSITORIES:
        return this.searchRepositories(
          dto.keywordsAndQualifiers,
          dto.sort,
          dto.order
        );
      case COMMITS:
        return this.searchCommits(
          dto.keywordsAndQualifiers,
          dto.sort,
          dto.order
        );
      case CODE:
        return this.searchCode(dto.keywordsAndQualifiers, dto.sort, dto.order);
      case ISSUES:
        return this.searchIssues(
          dto.keywordsAndQualifiers,
          dto.sort,
          dto.order
        );
      case USERS:
        return this.searchUsers(dto.keywordsAndQualifiers, dto.sort, dto.order);
      case TOPICS:
        return this.searchTopics(dto.keywordsAndQualifiers);
      case LABELS:
        if (!dto.repositoryID) {
          throw new Error("Missing searchLabels");
        }
        return this.searchLabels(
          dto.repositoryID,
          dto.keywordsAndQualifiers,
          dto.sort,
          dto.order
        );
      default:
        throw new Error("No such search Item: " + dto.searchItem);
    }
  }

  static async searchRepositories(
    keywordsAndQualifiers: string[],
    sort?: string,
    order?: string
  ) {
    let queryStrBuilder: GithubQueryStringBuilder = new GithubQueryStringBuilder(
      GITHUB_API_URL,
      REPOSITORIES
    );
    // console.log(keywordsAndQualifiers);
    queryStrBuilder.addKeywordsAndQualifiers(keywordsAndQualifiers);
    if (sort) {
      queryStrBuilder.addSort(sort);
    }
    if (order) {
      queryStrBuilder.addOrder(order);
    }
    const queryString = queryStrBuilder.getQueryString();
    return await this.fetchResultItemsFromGithub(queryString);
  }

  static async searchCommits(
    keywordsAndQualifiers: string[],
    sort?: string,
    order?: string
  ) {
    let queryStrBuilder: GithubQueryStringBuilder = new GithubQueryStringBuilder(
      GITHUB_API_URL,
      COMMITS
    );
    queryStrBuilder.addKeywordsAndQualifiers(keywordsAndQualifiers);
    if (sort) {
      queryStrBuilder.addSort(sort);
    }
    if (order) {
      queryStrBuilder.addOrder(order);
    }
    const queryString = queryStrBuilder.getQueryString();
    return await this.fetchResultItemsFromGithub(queryString);
  }

  static async searchCode(
    keywordsAndQualifiers: string[],
    sort?: string,
    order?: string
  ) {
    let queryStrBuilder: GithubQueryStringBuilder = new GithubQueryStringBuilder(
      GITHUB_API_URL,
      CODE
    );
    queryStrBuilder.addKeywordsAndQualifiers(keywordsAndQualifiers);
    if (sort) {
      queryStrBuilder.addSort(sort);
    }
    if (order) {
      queryStrBuilder.addOrder(order);
    }
    const queryString = queryStrBuilder.getQueryString();
    return await this.fetchResultItemsFromGithub(queryString);
  }

  static async searchIssues(
    keywordsAndQualifiers: string[],
    sort?: string,
    order?: string
  ) {
    let queryStrBuilder: GithubQueryStringBuilder = new GithubQueryStringBuilder(
      GITHUB_API_URL,
      ISSUES
    );
    queryStrBuilder.addKeywordsAndQualifiers(keywordsAndQualifiers);
    if (sort) {
      queryStrBuilder.addSort(sort);
    }
    if (order) {
      queryStrBuilder.addOrder(order);
    }
    const queryString = queryStrBuilder.getQueryString();
    return await this.fetchResultItemsFromGithub(queryString);
  }

  static async searchUsers(
    keywordsAndQualifiers: string[],
    sort?: string,
    order?: string
  ) {
    let queryStrBuilder: GithubQueryStringBuilder = new GithubQueryStringBuilder(
      GITHUB_API_URL,
      USERS
    );
    queryStrBuilder.addKeywordsAndQualifiers(keywordsAndQualifiers);
    if (sort) {
      queryStrBuilder.addSort(sort);
    }
    if (order) {
      queryStrBuilder.addOrder(order);
    }
    const queryString = queryStrBuilder.getQueryString();
    return await this.fetchResultItemsFromGithub(queryString);
  }

  static async searchTopics(keywordsAndQualifiers: string[]) {
    let queryStrBuilder: GithubQueryStringBuilder = new GithubQueryStringBuilder(
      GITHUB_API_URL,
      TOPICS
    );
    queryStrBuilder.addKeywordsAndQualifiers(keywordsAndQualifiers);
    const queryString = queryStrBuilder.getQueryString();
    return await this.fetchResultItemsFromGithub(queryString);
  }

  static async searchLabels(
    repostoryId: number,
    keywordsAndQualifiers: string[],
    sort?: string,
    order?: string
  ): Promise<object[]> {
    let queryStrBuilder: GithubQueryStringBuilder = new GithubQueryStringBuilder(
      GITHUB_API_URL,
      LABELS
    );
    queryStrBuilder.addRepositoryId(repostoryId);
    queryStrBuilder.addKeywordsAndQualifiers(keywordsAndQualifiers);
    if (sort) {
      queryStrBuilder.addSort(sort);
    }
    if (order) {
      queryStrBuilder.addOrder(order);
    }
    const queryString = queryStrBuilder.getQueryString();
    return await this.fetchResultItemsFromGithub(queryString);
  }

  private static async fetchResultItemsFromGithub(
    queryString: string
  ): Promise<object[]> {
    if (!RateLimiter.isAllowedNextQuery()) {
      throw new Error(RateLimiter.RATE_LIMIT_ERROR);
    }
    let response: AxiosResponse;
    try {
      response = await Axios.get(queryString);
    } catch (error) {
      let e: any = new Error("Github fetch error");
      e.axiosError = error;
      throw e;
    }
    let rateLimitRemaining: any = response.headers[RATE_LIMIT_REMAINING_HEADER];
    let rateLimitResetTime: any = response.headers[RATE_LIMIT_RESET_HEADER];
    if (
      typeof rateLimitRemaining === "string" &&
      typeof rateLimitResetTime === "string"
    ) {
      RateLimiter.setNextAllowedQueryTime(
        parseInt(rateLimitRemaining),
        parseInt(rateLimitResetTime)
      );
    } else {
      throw new Error("Rate limit missing");
    }
    const resultItems = this.extractItems(response.data.items);
    return resultItems;
  }

  private static extractItems(x: any): object[] {
    if (isArrayOfItems(x)) {
      return x;
    }
    throw new Error("Expected array of items");
  }
}
