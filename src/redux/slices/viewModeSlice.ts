import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum GridViewMode {
    GRID = "grid",
    LIST = "list",
}

interface ViewModeState {
    mode: GridViewMode;
}

const initialState: ViewModeState = {
    mode: GridViewMode.GRID,
};

const viewModeSlice = createSlice({
    name: "viewMode",
    initialState,
    reducers: {
        setViewMode: (state, action: PayloadAction<GridViewMode>) => {
            state.mode = action.payload;
        },
    },
});

export const { setViewMode } = viewModeSlice.actions;
export default viewModeSlice.reducer;
