import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import ThemeProvider from "./theme-provider";
import { store } from "./redux/store";
import App from "./App";


const queryClient = new QueryClient()

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <ThemeProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
        <ReactQueryDevtools initialIsOpen={false} position="top-right"/>
    </QueryClientProvider>,
    document.getElementById("root")
);
