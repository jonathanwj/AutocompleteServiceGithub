import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import matchSorter from "match-sorter";

const filterOptions = (options: any, { inputValue }: { inputValue: string }) =>
  matchSorter(options, inputValue, {
    keys: ["name"],
    threshold: matchSorter.rankings.NO_MATCH
  });

export default function SearchBar(props: any) {
  return (
    <Autocomplete
      onInputChange={props.onInputChange}
      id="search-api"
      style={{ width: "100%" }}
      open={props.open}
      onOpen={props.onOpen}
      onClose={props.onClose}
      getOptionSelected={(option: any, value) =>
        option.full_name === value.full_name
      }
      getOptionLabel={option => option.full_name}
      options={props.options}
      loading={props.isLoading}
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
                {props.isLoading ? (
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
