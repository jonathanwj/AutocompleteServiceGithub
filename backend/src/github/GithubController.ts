import GithubService from "./GithubService";

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
      return results;
    } catch (error) {
      console.log("githubcontroller", error);
    }
  }
}
