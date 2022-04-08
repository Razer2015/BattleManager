import React from 'react';
import ReactDOM from 'react-dom';
// import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: window?.config?.BACKEND_ENDPOINT ?? process.env.REACT_APP_GRAPHQL_HOST,
  credentials: 'include'
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  // if (graphQLErrors) {
  //   for (let err of graphQLErrors) {
  //     switch (err.extensions.code) {
  //     }
  //   }
  // }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// const root = createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <ApolloProvider client={client}>
//       <App />
//     </ApolloProvider>
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
