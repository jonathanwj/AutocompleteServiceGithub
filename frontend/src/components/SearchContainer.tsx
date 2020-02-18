import React from "react";
import SearchBar from "./SearchBar";
import RepositoryContainer from "./RepositoryContainer";

function sleep(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

export default function SearchContainer() {
  const [loading, setLoading] = React.useState(false);
  const [repositories, setRepositories] = React.useState<any[]>([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [prevSearchValue, setPrevSearchValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<any[]>([]);
  const [isSelected, setIsSelected] = React.useState(false);
  const [selectedRepository, setSelectedRepository] = React.useState({});

  React.useEffect(() => {
    if (loading) {
      return undefined;
    }

    if (searchValue === "" || searchValue === prevSearchValue || isSelected) {
      return undefined;
    }

    (async () => {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3001/search/repositories?q=" + searchValue
      );
      await sleep(1300);

      if (response.status === 200) {
        const repositories = await response.json();
        console.log(repositories);
        setRepositories(repositories.items);
        setPrevSearchValue(searchValue);
        setOptions(
          repositories.items.map((r: any) => {
            return { name: r.name, full_name: r.full_name };
          })
        );
      }
      setLoading(false);
    })();
  }, [searchValue, prevSearchValue, loading, isSelected]);

  function showRepository(value: string) {
    let selectedIndex: number = -1;
    repositories.forEach((r, index) => {
      if (r.full_name === value) {
        selectedIndex = index;
      }
    });
    if (selectedIndex === -1) return;
    setSelectedRepository(repositories[selectedIndex]);
  }

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
            setIsSelected(false);
            setPrevSearchValue(searchValue);
            setSearchValue(value);
            if (reason === "reset" && value !== "") {
              showRepository(value);
              setIsSelected(true);
            }
          }}
          open={open}
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
