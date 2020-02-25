export default class GithubQueryStringBuilder {
  githubDTO: GithubDTO = {};
  githubAPIUrl: string;
  constructor(githubAPIUrl: string, searchItem: string) {
    this.githubAPIUrl = githubAPIUrl;
    this.githubDTO.searchItem = searchItem;
  }

  addKeywordsAndQualifiers(keywordsAndQualifiers: string[]) {
    this.githubDTO.keywordsAndQualifiers = keywordsAndQualifiers;
  }

  addSort(sort: string) {
    this.githubDTO.sort = sort;
  }

  addOrder(order: string) {
    this.githubDTO.order = order;
  }

  addRepositoryId(respositoryID: number) {
    this.githubDTO.repositoryID = respositoryID;
  }

  getQueryString() {
    let queryString: string = "";
    queryString = queryString.concat(this.githubAPIUrl);
    if (this.githubDTO.searchItem) {
      queryString = queryString.concat(this.githubDTO.searchItem);
    }
    if (this.githubDTO.repositoryID) {
      queryString = queryString.concat(this.githubDTO.repositoryID.toString());
    }
    queryString = queryString.concat("?");
    if (this.githubDTO.keywordsAndQualifiers) {
      queryString = queryString.concat("&q=");
      queryString = queryString.concat(
        this.githubDTO.keywordsAndQualifiers.join("+")
      );
    }
    if (this.githubDTO.sort) {
      queryString = queryString.concat("&sort=");
      queryString = queryString.concat(this.githubDTO.sort);
    }
    if (this.githubDTO.order) {
      queryString = queryString.concat("&order=");
      queryString = queryString.concat(this.githubDTO.order);
    }
    return queryString;
  }
}
