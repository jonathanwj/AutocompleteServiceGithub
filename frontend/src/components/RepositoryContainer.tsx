import React from "react";
import { Container } from "@material-ui/core";

export default function RepositoryContainer(props: any) {
  let repo = props.repository;
  return (
    <Container>
      <h1>{repo.full_name}</h1>
      <h2>{repo.name}</h2>
      <p>{repo.description}</p>
      <a href={`${repo.html_url}`}>{repo.html_url}</a>
    </Container>
  );
}
