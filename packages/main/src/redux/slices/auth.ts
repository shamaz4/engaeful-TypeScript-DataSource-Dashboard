/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    authenticating: boolean;
    isAuthenticated: boolean;
    userObject: any;
    websites: any;
    selectedWebsite: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: Date;
    refreshTokenExpires: Date;
}

const initialState: AuthState = {
    authenticating: true,
    isAuthenticated: false,
    userObject: {
        name: "",
        email: ""
    },
    websites: [],
    selectedWebsite: "",
    accessToken: "",
    refreshToken: "",
    accessTokenExpires: new Date(),
    refreshTokenExpires: new Date(),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthenticated(
            state,
            action: PayloadAction<{
                authenticated: boolean;
                userObject: any;
                websites: [any];
                accessToken: string;
                accessTokenExpires: Date;
                refreshToken: string;
                refreshTokenExpires: Date;
            }>
        ) {
            const {
                payload: {
                    authenticated,
                    userObject,
                    websites,
                    accessToken,
                    refreshToken,
                    accessTokenExpires,
                    refreshTokenExpires,
                },
            } = action;
            state.authenticating = false;
            state.isAuthenticated = authenticated;
            state.userObject = userObject;
            state.websites = websites;
            state.selectedWebsite = websites[0].id;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.accessTokenExpires = accessTokenExpires;
            state.refreshTokenExpires = refreshTokenExpires;
        },
        refreshTokens(
            state,
            action: PayloadAction<{
                accessToken: string;
                refreshToken: string;
            }>
        ) {
            const {
                payload: { accessToken, refreshToken },
            } = action;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
        },
        setWebsites(
            state,
            action: PayloadAction<{
                websites: [];
            }>
        ) {
            const {
                payload: { websites },
            } = action;
            state.websites = websites;
        },
        logout(state) {
            state.authenticating = false;
            state.isAuthenticated = false;
            state.userObject = {
                name: "",
                email: "",
            };
            state.websites = [];
            state.accessToken = "";
            state.refreshToken = "";
            state.accessTokenExpires = new Date();
            state.refreshTokenExpires = new Date();
        },
    },
});

export const { setAuthenticated, refreshTokens, logout, setWebsites } = authSlice.actions;
export default authSlice.reducer;
