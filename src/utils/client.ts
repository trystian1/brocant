import { Header } from "@/components/Header";
import {
  ApolloClient,
  DefaultOptions,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { NextPageContext } from "next";
import { useState } from "react";
const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

export const getClient = new ApolloClient({
  uri: "https://eu-central-1-shared-euc1-02.cdn.hygraph.com/content/clfk1f1f10k0i01uh0s9i8s5y/master",
  cache: new InMemoryCache(),
  defaultOptions,
});

export const getClientCached = new ApolloClient({
  uri: "https://eu-central-1-shared-euc1-02.cdn.hygraph.com/content/clfk1f1f10k0i01uh0s9i8s5y/master",
  cache: new InMemoryCache(),
});

export const mutationClient = new ApolloClient({
  uri: "https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/clfk1f1f10k0i01uh0s9i8s5y/master",
  cache: new InMemoryCache(),
  defaultOptions,
});
