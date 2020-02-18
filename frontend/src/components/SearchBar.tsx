import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import matchSorter from "match-sorter";

interface Repository {
  name: string;
}

function sleep(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

const filterOptions = (options: any, { inputValue }: { inputValue: string }) =>
  matchSorter(options, inputValue, {
    keys: ["name"],
    threshold: matchSorter.rankings.NO_MATCH
  });

export default function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Repository[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [prevSearchValue, setPrevSearchValue] = React.useState("");

  React.useEffect(() => {
    if (loading) {
      return undefined;
    }

    if (searchValue === "" || searchValue === prevSearchValue) {
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
        setOptions(repositories.items as Repository[]);
        setPrevSearchValue(searchValue);
      }
      setLoading(false);
    })();
  }, [searchValue, prevSearchValue, loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      onInputChange={(event, value) => {
        setPrevSearchValue(searchValue);
        setSearchValue(value);
      }}
      id="search-api"
      style={{ width: "100%" }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option: any, value) =>
        option.full_name === value.name
      }
      getOptionLabel={option => option.full_name}
      options={options}
      loading={loading}
      filterOptions={filterOptions}
      renderInput={params => (
        <TextField
          {...params}
          label="Search Github"
          fullWidth
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
}
