import React from "react";
import RepositoryContainer from "./RepositoryContainer";
import SearchRepositorySearchBar from "./SearchRepositorySearchBar";
import { Select, MenuItem, FormControl, Typography } from "@material-ui/core";
import { GithubSearchItems } from "../api/GithubSearchItems";
import SearchUsersSearchBar from "./SearchUsersSearchBar";
import SearchTopicsSearchBar from "./SearchTopicsSearchBar";

export default function SearchContainer() {
  const [selectedRepository, setSelectedRepository] = React.useState({});
  const [selectedSearchItem, setSelectedSearchItem] = React.useState(
    GithubSearchItems.Repo
  );
  return (
    <div>
      <Typography variant="h5">
        Github Search Autocomplete Service
      </Typography>
      <div style={{ display: "flex", marginTop: "1em" }}>
        <div style={{ flexGrow: 1 }}>
          {selectedSearchItem === GithubSearchItems.Repo && (
            <SearchRepositorySearchBar
              onSelectedRepository={(repo: any) => {
                setSelectedRepository(repo);
              }}
            ></SearchRepositorySearchBar>
          )}
          {selectedSearchItem === GithubSearchItems.Users && (
            <SearchUsersSearchBar></SearchUsersSearchBar>
          )}
          {selectedSearchItem === GithubSearchItems.Topics && (
            <SearchTopicsSearchBar></SearchTopicsSearchBar>
          )}
        </div>
        <div>
          <FormControl variant="outlined" style={{ width: "10em" }}>
            <Select
              value={selectedSearchItem}
              onChange={(e: any) => {
                setSelectedSearchItem(e.target.value);
                setSelectedRepository({});
              }}
              displayEmpty
            >
              <MenuItem value={GithubSearchItems.Repo}>
                {GithubSearchItems.Repo}
              </MenuItem>
              <MenuItem value={GithubSearchItems.Users}>
                {GithubSearchItems.Users}
              </MenuItem>
              <MenuItem value={GithubSearchItems.Topics}>
                {GithubSearchItems.Topics}
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      {Object.keys(selectedRepository).length === 0 ? (
        <div></div>
      ) : (
        <div>
          <RepositoryContainer
            repository={selectedRepository}
          ></RepositoryContainer>
        </div>
      )}
    </div>
  );
}
