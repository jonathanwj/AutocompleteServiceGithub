import React, { useRef } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import matchSorter from "match-sorter";

const filterOptions = (options: any, { inputValue }: { inputValue: string }) =>
  matchSorter(options, inputValue, {
    keys: ["name"]
  });

const SearchBar = (props: any) => {
  const autoCompleteRef = useRef<any>(null);

  // on options element hover, stop fetchData
  React.useEffect(() => {
    const eObserver = new MutationObserver((mutationList, observer) => {
      mutationList.forEach(m => {
        if (m.attributeName === "aria-activedescendant" && m.oldValue == null) {
          props.onOptionHover();
        }
      });
    });
    // add observer to element to watch for attribure changes
    if (autoCompleteRef != null && autoCompleteRef.current != null) {
      const inputElementToWatch =
        autoCompleteRef.current.firstElementChild.firstElementChild
          .nextElementSibling.firstElementChild;
      eObserver.observe(inputElementToWatch, {
        attributes: true,
        attributeOldValue: true
      });
    }
    return () => {
      eObserver.disconnect();
    };
  }, [props]);

  return (
    <Autocomplete
      ref={autoCompleteRef}
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
};

export default SearchBar;
