import React from "react";
import "./App.css";
import { Grid } from "@material-ui/core";
import SearchContainer from "./components/SearchContainer";

function App() {
  return (
    <div className="App">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={6} style={{ width: "100%" }}>
          <SearchContainer></SearchContainer>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
