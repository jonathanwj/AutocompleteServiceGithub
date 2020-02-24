import GithubQueryStringBuilder from "./GithubQueryStringBuilder";
export default class GithubAPI {
  static apiUrl = "http://localhost:3001/github/search/";

  static async fetchRepositories(
    keywordsAndQualifiers: string[],
    sort?: string,
    order?: string
  ) {
    let queryStringBuilder = new GithubQueryStringBuilder(
      this.apiUrl,
      "repositories"
    );
    if (!keywordsAndQualifiers || keywordsAndQualifiers.length === 0) {
      throw new Error("No keyword and qualifier specified");
    }
    keywordsAndQualifiers.forEach(item => {
      queryStringBuilder.addKeywordOrQualifier(item);
    });
    if (sort) {
      queryStringBuilder.addSort(sort);
    }
    if (order) {
      queryStringBuilder.addOrder(order);
    }
    const response = await fetch(queryStringBuilder.getQueryString());
    return response;
  }
}
