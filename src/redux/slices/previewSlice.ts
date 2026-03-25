import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPreviewToken } from "../../types/preview";
import { RootState } from "../store";

const initialState: IPreviewToken = {
    token: "",
    url: "",
    expiry: "",
    check_expiry: true,
};

const previewSlice = createSlice({
    name: "previewToken",
    initialState,
    reducers: {
        setPreviewToken: (_, action: PayloadAction<IPreviewToken>) => {
            return action.payload;
        },
        clearPreviewToken: () => initialState,
    },
});

export const { setPreviewToken, clearPreviewToken } = previewSlice.actions;
export const selectPreviewToken = (state: RootState) => state.previewToken;
export default previewSlice.reducer;