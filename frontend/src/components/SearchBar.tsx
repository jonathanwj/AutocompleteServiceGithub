import React, { useRef } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fuse from "fuse.js";

const fuseOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["name"]
};

const filterOptions = (
  options: any,
  { inputValue }: { inputValue: string }
) => {
  let fuse = new Fuse(options, fuseOptions);
  let result = fuse.search(inputValue);
  return result;
};

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

  // watch enter button press
  React.useEffect(() => {
    const inputElementToWatch =
      autoCompleteRef.current.firstElementChild.firstElementChild
        .nextElementSibling.firstElementChild;
    const handleKeyup = (event: any) => {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        props.onEnterPressed();
      }
    };
    inputElementToWatch.addEventListener("keyup", handleKeyup);
    return () => {
      inputElementToWatch.removeEventListener("keyup", handleKeyup);
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
      onChange={(e: any, value: any) => {
        if (value) props.onOptionSelected(value.full_name);
      }}
      getOptionSelected={(option: any, value) =>
        option.full_name === value.full_name
      }
      getOptionLabel={option => {
        if (!option.full_name) {
          return "";
        }
        return option.full_name;
      }}
      options={props.options}
      loading={props.isLoading}
      filterOptions={filterOptions}
      freeSolo={props.freeSolo ? props.freeSolo : false}
      renderInput={params => (
        <TextField
          {...params}
          label={props.label ? props.label : "Search"}
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
