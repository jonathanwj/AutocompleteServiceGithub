import React, { useRef } from "react";
import SearchBar from "./SearchBar";
import RepositoryContainer from "./RepositoryContainer";
import GithubAPI from "../api/GithubAPI";
import { stringToArray } from "../api/Utils";

export default function SearchContainer() {
  const [loading, setLoading] = React.useState(false);
  const [repositories, setRepositories] = React.useState<any[]>([]);
  const [options, setOptions] = React.useState<any[]>([]);

  const [searchValue, setSearchValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const [optionIsSelected, setOptionIsSelected] = React.useState(false);
  const [selectedRepository, setSelectedRepository] = React.useState({});

  const typeTimer = useRef<any>(null);
  const typeTimeDelay = 1000;
  const [refetchToggle, setRefetchToggle] = React.useState({});

  // fetch data from backend on SearchBar value change
  React.useEffect(() => {
    async function fetchData() {
      try {
        const repos = await GithubAPI.searchRepositories(
          stringToArray(searchValue)
        );
        if (repos.rate_limited_reached) {
          setRefetchToggle({});
          return;
        }
        let opts = repos.items.map((r: any) => {
          return { name: r.name, full_name: r.full_name };
        });
        setRepositories(repos.items);
        setOptions(opts);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setRefetchToggle({});
      }
    }

    if (searchValue === "") {
      setLoading(false);
      clearTimeout(typeTimer.current);
      setSelectedRepository({});
      return undefined;
    }

    if (optionIsSelected) {
      setLoading(false);
      clearTimeout(typeTimer.current);
      return undefined;
    }
    setLoading(true);
    // fetch only when user stops typing for awhile
    clearTimeout(typeTimer.current);
    typeTimer.current = setTimeout(() => {
      fetchData();
    }, typeTimeDelay);
  }, [searchValue, optionIsSelected, refetchToggle]);

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

  function handleOnEnterPressed() {
    setLoading(false);
    clearTimeout(typeTimer.current);
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
          onOptionHover={() => {
            setOptionIsSelected(true);
          }}
          onOptionSelected={(value: any) => {
            showRepository(value);
            setOptionIsSelected(true);
          }}
          onEnterPressed={() => {
            handleOnEnterPressed();
          }}
          onInputChange={(event: any, value: any, reason: any) => {
            setOptionIsSelected(false);
            setSearchValue(value);
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
