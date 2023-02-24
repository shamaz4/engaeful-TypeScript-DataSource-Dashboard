/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface EmailState {
    senderProfiles: [];
    emailDomains: [];
}

const initialState: EmailState = {
    senderProfiles: [],
    emailDomains: [],
};

const emailSlice = createSlice({
    name: "email",
    initialState,
    reducers: {
        resetEmailState(
            state,
        ) {
            state.senderProfiles = [];
            state.emailDomains = [];
        },
        addSenderProfile(
            state,
            action: PayloadAction<{
                senderProfile: any;
            }>
        ) {
            state.senderProfiles.push(action.payload.senderProfile);
        },
        addEmailDomain(
            state,
        action: PayloadAction<{
                emailDomain: any;
            }>
        ) {
            state.emailDomains.push(action.payload.emailDomain);
        },
    },
});

export const { resetEmailState, addSenderProfile, addEmailDomain } = emailSlice.actions;
export default emailSlice.reducer;
