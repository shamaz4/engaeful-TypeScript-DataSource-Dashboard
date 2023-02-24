/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CampaignEditorState {
    showExitWarning: boolean;
}

const initialState: CampaignEditorState = {
    showExitWarning: false,
};

const campaignEditorSlice = createSlice({
    name: "campaignEditor",
    initialState,
    reducers: {
        setShowExitWarning(
            state,
            action: PayloadAction<{
                showWarning: boolean;
            }>
        ) {
            const {
                payload: { showWarning },
            } = action;
            state.showExitWarning = showWarning;
        },
    },
});

export const { setShowExitWarning } = campaignEditorSlice.actions;
export default campaignEditorSlice.reducer;
