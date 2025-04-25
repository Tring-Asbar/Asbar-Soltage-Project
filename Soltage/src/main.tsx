import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { BrowserRouter } from 'react-router-dom'
import { Amplify } from 'aws-amplify'
import {ApolloClient,InMemoryCache,ApolloProvider, HttpLink, from} from '@apollo/client'
import { setContext } from "@apollo/client/link/context";
import { amplifyConfig,config } from './Config/config'
import App from './App'
  
Amplify.configure(amplifyConfig)
  
  const httpLink = new HttpLink({
    uri :config.backend_url,
  })

  export const getAccessTokenFromLocalStorage = () => {
    const keys = Object.keys(localStorage);
    const tokenKey = keys.find((key) =>
      key.endsWith(".accessToken")
    );
    
    return tokenKey ? localStorage.getItem(tokenKey) : null;
  };

  const authLink = setContext((_: any, { headers }:any) => {
    const token = getAccessTokenFromLocalStorage();
    console.log(token)
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: from([authLink,httpLink]),
    cache:new InMemoryCache(),
  });
  const root = document.getElementById("root") as HTMLElement
  createRoot(root).render(
  
  <StrictMode>
    <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
    </BrowserRouter>
  </StrictMode>,
)
