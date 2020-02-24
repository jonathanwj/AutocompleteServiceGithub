import React, { useRef } from "react";
import RepositoryContainer from "./RepositoryContainer";
import SearchRepositorySearchBar from "./SearchRepositorySearchBar";
import { Select, MenuItem } from "@material-ui/core";
import { GithubSearchItems } from "../api/GithubSearchItems";
import SearchUsersSearchBar from "./SearchUsersSearchBar";

export default function SearchContainer() {
  const [selectedRepository, setSelectedRepository] = React.useState({});
  const [selectedSearchItem, setSelectedSearchItem] = React.useState(
    GithubSearchItems.Repo
  );
  return (
    <div>
      <h2>Github search autocomplete Service</h2>
      <div>
        {selectedSearchItem === GithubSearchItems.Repo ? (
          <SearchRepositorySearchBar
            onSelectedRepository={(repo: any) => {
              setSelectedRepository(repo);
            }}
          ></SearchRepositorySearchBar>
        ) : (
          <SearchUsersSearchBar></SearchUsersSearchBar>
        )}
      </div>
      <div>
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
        </Select>
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
