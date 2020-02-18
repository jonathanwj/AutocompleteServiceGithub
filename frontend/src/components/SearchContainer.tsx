import React from "react";
import SearchBar from "./SearchBar";
import RepositoryContainer from "./RepositoryContainer";

export default function SearchContainer() {
  return (
    <div>
      <h2>Github search autocomplete Service</h2>
      <div>
        <SearchBar></SearchBar>
      </div>
      <div>
        <RepositoryContainer></RepositoryContainer>
      </div>
    </div>
  );
}
