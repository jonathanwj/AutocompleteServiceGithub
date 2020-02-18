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
  matchSorter(options, inputValue, { keys: ["name"] });

export default function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Repository[]>([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await fetch(
        "http://localhost:3001/search/repositories?q=tetris"
      );
      await sleep(1e3); // For demo purposes.
      const repositories = await response.json();
      console.log(repositories);

      if (active) {
        setOptions(repositories.items as Repository[]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option: any, value) => option.name === value.name}
      getOptionLabel={option => option.name}
      options={options}
      loading={loading}
      filterOptions={filterOptions}
      renderInput={params => (
        <TextField
          {...params}
          label="Asynchronous"
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
