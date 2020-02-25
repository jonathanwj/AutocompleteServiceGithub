export default class GithubQueryStringBuilder {
  githubAPIUrl: string;
  searchItem: string;
  keywordsAndQualifiers: string[];
  sort?: string;
  order?: string;
  repositoryID?: number;

  constructor(githubAPIUrl: string, searchItem: string) {
    this.githubAPIUrl = githubAPIUrl;
    this.searchItem = searchItem;
    this.keywordsAndQualifiers = [];
    this.sort = undefined;
    this.order = undefined;
    this.repositoryID = undefined;
  }

  addKeywordOrQualifier(keywordsOrQualifier: string) {
    this.keywordsAndQualifiers.push(keywordsOrQualifier);
  }

  addSort(sort: string) {
    this.sort = sort;
  }

  addOrder(order: string) {
    this.order = order;
  }

  addRepositoryId(respositoryID: number) {
    this.repositoryID = respositoryID;
  }

  getQueryString() {
    let queryString: string = "";
    queryString = queryString.concat(this.githubAPIUrl);
    if (this.searchItem) {
      queryString = queryString.concat(this.searchItem);
    }
    if (this.repositoryID) {
      queryString = queryString.concat(this.repositoryID.toString());
    }
    queryString = queryString.concat("?");
    if (this.keywordsAndQualifiers) {
      queryString = queryString.concat("&q=");
      queryString = queryString.concat(this.keywordsAndQualifiers.join("+"));
    }
    if (this.sort) {
      queryString = queryString.concat("&sort=");
      queryString = queryString.concat(this.sort);
    }
    if (this.order) {
      queryString = queryString.concat("&order=");
      queryString = queryString.concat(this.order);
    }
    return queryString;
  }
}
