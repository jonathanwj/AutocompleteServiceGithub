import React, { useRef, useCallback } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  makeStyles
} from "@material-ui/core";
import SearchBar from "./SearchBar";
import GithubAPI from "../api/GithubAPI";
import { stringToArray } from "../api/Utils";
import { GithubSearchItems } from "../api/GithubSearchItems";

export default function RepositoryContainer(props: any) {
  let repo = props.repository;
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<any[]>([]);

  const [searchValue, setSearchValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const [optionIsSelected, setOptionIsSelected] = React.useState(false);

  const typeTimer = useRef<any>(null);
  const typeTimeDelay = 1000;
  const [refetchToggle, setRefetchToggle] = React.useState({});

  const [selectedSearchItem, setSelectedSearchItem] = React.useState(
    GithubSearchItems.Commits
  );

  function dataToOpts(searchItemType: string, data: any): any[] {
    let opts = [];
    switch (searchItemType) {
      case GithubSearchItems.Commits:
        opts = data.items.map((item: any) => {
          return {
            name: item.commit.message,
            full_name: item.commit.message,
            ...item
          };
        });
        break;
      case GithubSearchItems.IssuesAndPR:
        opts = data.items.map((item: any) => {
          return { name: item.title, full_name: item.title, ...item };
        });
        break;
      default:
        throw new Error("Missing searchItem Type");
    }
    return opts;
  }

  const fetchData = useCallback(async () => {
    try {
      let data: any;
      switch (selectedSearchItem) {
        case GithubSearchItems.Commits:
          data = await GithubAPI.searchCommits(
            stringToArray(searchValue),
            repo.full_name
          );
          break;
        case GithubSearchItems.IssuesAndPR:
          data = await GithubAPI.searchIssuesAndPR(
            stringToArray(searchValue),
            repo.full_name
          );
          break;
        default:
          throw new Error("Missing searchItem type");
      }
      if (data.rate_limited_reached) {
        setRefetchToggle({});
        return;
      }
      let opts = dataToOpts(selectedSearchItem, data);
      setOptions(opts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setRefetchToggle({});
    }
  }, [searchValue, repo, selectedSearchItem]);

  // fetch data from backend on SearchBar value change
  React.useEffect(() => {
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
    }, typeTimeDelay);
    return () => {
      clearTimeout(typeTimer.current);
    };
  }, [searchValue, optionIsSelected, refetchToggle, fetchData]);

  function handleOnEnterPressed() {
    setLoading(false);
    clearTimeout(typeTimer.current);
  }

  function goToUrl(searchBarValue: string) {
    let selectedIndex: number = -1;
    options.forEach((opt, index) => {
      if (opt.full_name === searchBarValue) {
        selectedIndex = index;
      }
    });
    if (selectedIndex === -1) return;
    let selectedOption = options[selectedIndex];
    switch (selectedSearchItem) {
      case GithubSearchItems.Commits:
        window.open(selectedOption.html_url);
        break;
      case GithubSearchItems.IssuesAndPR:
        window.open(selectedOption.html_url);
        break;
      default:
        throw new Error("Missing searchItem Type");
    }
  }

  const classes = useStyles();

  return (
    <div style={{ marginTop: "1em" }}>
      <div style={{ textAlign: "left" }}>
        <Card className={classes.root}>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              {repo.full_name}
            </Typography>
            <Typography variant="h5" component="h2">
              {repo.name}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {repo.description}
            </Typography>
            <div style={{ display: "flex", margin:"1em" }}>
              <div style={{ flexGrow: 1 }}>
                <SearchBar
                  label={"Search " + selectedSearchItem}
                  isLoading={loading}
                  options={options}
                  freeSolo={true}
                  onOptionHover={() => {
                    setOptionIsSelected(true);
                  }}
                  onOptionSelected={(value: any) => {
                    goToUrl(value);
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
                <FormControl variant="outlined" style={{ width: "8em" }}>
                  <Select
                    value={selectedSearchItem}
                    onChange={(e: any) => {
                      setSelectedSearchItem(e.target.value);
                      setOptions([]);
                    }}
                    displayEmpty
                  >
                    <MenuItem value={GithubSearchItems.Commits}>
                      {GithubSearchItems.Commits}
                    </MenuItem>
                    <MenuItem value={GithubSearchItems.IssuesAndPR}>
                      {GithubSearchItems.IssuesAndPR}
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </CardContent>
          <CardActions>
            <Button
              onClick={() => {
                window.open(repo.html_url);
              }}
              size="small"
            >
              Go to Repository
            </Button>
          </CardActions>
        </Card>
      </div>
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});
