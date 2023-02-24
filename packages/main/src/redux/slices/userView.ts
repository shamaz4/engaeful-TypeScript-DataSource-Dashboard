/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserViewState {
    selected: string[];
    available: string[];
}

const initialState: UserViewState = {
    selected: ["name", "health", "last_seen", "createdAt"],
    available: ["name", "health", "last_seen", "createdAt"],
};

const userViewSlice = createSlice({
    name: "userView",
    initialState,
    reducers: {
        setAvailableUserView(
            state,
            action: PayloadAction<{
               values : string[];
            }>
        ) {
            const {
                payload: { values },
            } = action;
            state.available = values;
        },
        setSelectedUserView(
            state,
            action: PayloadAction<{
               values : string[];
            }>
        ) {
            const {
                payload: { values },
            } = action;
            state.selected = values;
        },
    },
});

export const { setAvailableUserView, setSelectedUserView } = userViewSlice.actions;
export default userViewSlice.reducer;
