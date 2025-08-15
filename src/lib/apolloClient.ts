import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { nhost } from "./nhost";
import { config } from "../config";

const httpLink = new HttpLink({
  uri: `https://${config.nhost.subdomain}.nhost.run/v1/graphql`,
  fetch: async (uri, options) => {
    const token = nhost.auth.getAccessToken();
    if (options && options.headers) {
      options.headers = { Authorization: token ? `Bearer ${token}` : "" };
    }
    return fetch(uri, options);
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `wss://${config.nhost.subdomain}.nhost.run/v1/graphql`,
    connectionParams: async () => {
      const token = nhost.auth.getAccessToken();
      return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === "OperationDefinition" && def.operation === "subscription";
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});