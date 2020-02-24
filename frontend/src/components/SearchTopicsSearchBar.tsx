import React, { useRef } from "react";
import SearchBar from "./SearchBar";
import GithubAPI from "../api/GithubAPI";
import { stringToArray } from "../api/Utils";

export default function SearchTopicsSearchBar(props: any) {
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<any[]>([]);

  const [searchValue, setSearchValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const [optionIsSelected, setOptionIsSelected] = React.useState(false);

  const typeTimer = useRef<any>(null);
  const typeTimeDelay = 1000;
  const [refetchToggle, setRefetchToggle] = React.useState({});

  // fetch data from backend on SearchBar value change
  React.useEffect(() => {
    async function fetchData() {
      try {
        const topics = await GithubAPI.searchTopics(stringToArray(searchValue));
        if (topics.rate_limited_reached) {
          setRefetchToggle({});
          return;
        }
        let opts = topics.items.map((topic: any) => {
          return {
            name: topic.name,
            full_name: topic.name,
            ...topic
          };
        });
        console.log(opts);
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

  function goToUrl(searchBarValue: string) {
    let selectedIndex: number = -1;
    options.forEach((opt, index) => {
      if (opt.full_name === searchBarValue) {
        selectedIndex = index;
      }
    });
    if (selectedIndex === -1) return;
    let selectedOption = options[selectedIndex];
    window.open("https://github.com/topics/" + selectedOption.name);
  }

  return (
    <div>
      <div>
        <SearchBar
          isLoading={loading}
          options={options}
          freeSolo={true}
          onOptionHover={() => {
            setOptionIsSelected(true);
          }}
          onOptionSelected={(value: any) => {
            setOptionIsSelected(true);
            goToUrl(value);
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
    </div>
  );
}
