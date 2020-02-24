import GithubQueryStringBuilder from "./GithubQueryStringBuilder";
export default class GithubAPI {
  static apiUrl = "http://localhost:3001/github/search/";

  static async searchRepositories(
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
    const response = await this.fetchFromBackend(
      queryStringBuilder.getQueryString()
    );
    return response;
  }
  static async searchCommits(
    keywordsAndQualifiers: string[],
    repositoryFullName: string,
    sort?: string,
    order?: string
  ) {
    let queryStringBuilder = new GithubQueryStringBuilder(
      this.apiUrl,
      "commits"
    );
    if (!keywordsAndQualifiers || keywordsAndQualifiers.length === 0) {
      throw new Error("No keyword and qualifier specified");
    }
    queryStringBuilder.addKeywordOrQualifier("repo:" + repositoryFullName);
    keywordsAndQualifiers.forEach(item => {
      queryStringBuilder.addKeywordOrQualifier(item);
    });
    if (sort) {
      queryStringBuilder.addSort(sort);
    }
    if (order) {
      queryStringBuilder.addOrder(order);
    }
    const response = await this.fetchFromBackend(
      queryStringBuilder.getQueryString()
    );
    return response;
  }

  static async searchCode(
    keywordsAndQualifiers: string[],
    repositoryFullName: string,
    sort?: string,
    order?: string
  ) {
    let queryStringBuilder = new GithubQueryStringBuilder(
      this.apiUrl,
      "commits"
    );
    if (!keywordsAndQualifiers || keywordsAndQualifiers.length === 0) {
      throw new Error("No keyword and qualifier specified");
    }
    queryStringBuilder.addKeywordOrQualifier("repo:" + repositoryFullName);
    keywordsAndQualifiers.forEach(item => {
      queryStringBuilder.addKeywordOrQualifier(item);
    });
    if (sort) {
      queryStringBuilder.addSort(sort);
    }
    if (order) {
      queryStringBuilder.addOrder(order);
    }
    const response = await this.fetchFromBackend(
      queryStringBuilder.getQueryString()
    );
    return response;
  }

  static async searchIssuesAndPR(
    keywordsAndQualifiers: string[],
    repositoryFullName: string,
    sort?: string,
    order?: string
  ) {
    let queryStringBuilder = new GithubQueryStringBuilder(
      this.apiUrl,
      "issues"
    );
    if (!keywordsAndQualifiers || keywordsAndQualifiers.length === 0) {
      throw new Error("No keyword and qualifier specified");
    }
    queryStringBuilder.addKeywordOrQualifier("repo:" + repositoryFullName);
    keywordsAndQualifiers.forEach(item => {
      queryStringBuilder.addKeywordOrQualifier(item);
    });
    if (sort) {
      queryStringBuilder.addSort(sort);
    }
    if (order) {
      queryStringBuilder.addOrder(order);
    }
    const response = await this.fetchFromBackend(
      queryStringBuilder.getQueryString()
    );
    return response;
  }

  static async fetchFromBackend(queryString: string) {
    try {
      const response = await fetch(queryString);
      if (response.status === 200) {
        const responseData = await response.json();
        return responseData;
      } else {
        throw new Error("not 200 ok");
      }
    } catch (error) {
      throw error;
    }
  }
}
