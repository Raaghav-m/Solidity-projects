import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { MoralisProvider } from "react-moralis";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useQuery,
} from "@apollo/client";

let client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/81310/nft-marketplace/v0.0.1",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </MoralisProvider>
  </React.StrictMode>
);
