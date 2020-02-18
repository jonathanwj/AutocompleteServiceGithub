import React, { useRef } from "react";
import SearchBar from "./SearchBar";
import RepositoryContainer from "./RepositoryContainer";

const apiUrl = "http://localhost:3001/search/repositories?q=";

export default function SearchContainer() {
  const [loading, setLoading] = React.useState(false);
  const [repositories, setRepositories] = React.useState<any[]>([]);
  const [options, setOptions] = React.useState<any[]>([]);

  const [searchValue, setSearchValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const [optionIsSelected, setOptionIsSelected] = React.useState(false);
  const [selectedRepository, setSelectedRepository] = React.useState({});

  const typeTimer = useRef<any>(null);

  // fetch data from backend on SearchBar value change
  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch(apiUrl + searchValue);
      if (response.status === 200) {
        let repos = await response.json();
        let opts = repos.items.map((r: any) => {
          return { name: r.name, full_name: r.full_name };
        });
        setRepositories(repos.items);
        setOptions(opts);
      }
      setLoading(false);
    }

    if (searchValue === "" || optionIsSelected) {
      setLoading(false);
      clearTimeout(typeTimer.current);
      return undefined;
    }

    setLoading(true);
    // fetch only when user stops typing for awhile
    clearTimeout(typeTimer.current);
    typeTimer.current = setTimeout(() => {
      fetchData();
    }, 2000);
  }, [searchValue, optionIsSelected]);

  function showRepository(searchBarValue: string) {
    let selectedIndex: number = -1;
    repositories.forEach((r, index) => {
      if (r.full_name === searchBarValue) {
        selectedIndex = index;
      }
    });
    if (selectedIndex === -1) return;
    setSelectedRepository(repositories[selectedIndex]);
  }

  // clear options on searchbar close
  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <div>
      <h2>Github search autocomplete Service</h2>
      <div>
        <SearchBar
          isLoading={loading}
          options={options}
          onInputChange={(event: any, value: any, reason: any) => {
            setOptionIsSelected(false);
            setSearchValue(value);
            if (reason === "reset" && value !== "") {
              showRepository(value);
              setOptionIsSelected(true);
            }
          }}
          open={searchValue !== "" && open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
        ></SearchBar>
      </div>
      <div>
        <RepositoryContainer
          repository={selectedRepository}
        ></RepositoryContainer>
      </div>
    </div>
  );
}
