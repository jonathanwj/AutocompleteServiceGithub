import Axios from "axios";
import GithubQueryStringBuilder from "./GithubQueryStringBuilder";
import { isArrayOfItems } from "./utils";

const GITHUB_API_URL = "https://api.github.com/search/";

const REPOSITORIES = "repositories";
const COMMITS = "commits";
const CODE = "code";
const ISSUES = "issues";
const USERS = "users";
const TOPICS = "topics";
const LABELS = "labels";

export default class GithubService {
  static async searchGithubAPI(dto: GithubDTO): Promise<object[]> {
    if (!dto.keywordsAndQualifiers) {
      return Promise.reject("Missing keywordsAndQualifiers");
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
          return Promise.reject("Missing searchLabels");
        }
        return this.searchLabels(
          dto.repositoryID,
          dto.keywordsAndQualifiers,
          dto.sort,
          dto.order
        );
      default:
        return Promise.reject("No such search Item: " + dto.searchItem);
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
    const response = await Axios.get(queryString);
    return response.data.items;
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
    const response = await Axios.get(queryString);
    return this.checkArrayOfItems(response.data.items);
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
    const response = await Axios.get(queryString);
    return this.checkArrayOfItems(response.data.items);
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
    const response = await Axios.get(queryString);
    return this.checkArrayOfItems(response.data.items);
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
    const response = await Axios.get(queryString);
    return this.checkArrayOfItems(response.data.items);
  }

  static async searchTopics(keywordsAndQualifiers: string[]) {
    let queryStrBuilder: GithubQueryStringBuilder = new GithubQueryStringBuilder(
      GITHUB_API_URL,
      TOPICS
    );
    queryStrBuilder.addKeywordsAndQualifiers(keywordsAndQualifiers);
    const queryString = queryStrBuilder.getQueryString();
    const response = await Axios.get(queryString);
    return this.checkArrayOfItems(response.data.items);
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
    const response = await Axios.get(queryString);
    return this.checkArrayOfItems(response.data.items);
  }

  private static checkArrayOfItems(x: any): object[] {
    if (isArrayOfItems(x)) {
      return x;
    }
    throw new Error("Expected array of items");
  }
}
