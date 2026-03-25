import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Permission, PermissionState } from "../../types/permission";

const initialState: Permission = {
  permissions: [],
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<PermissionState[]>) => {
      state.permissions = action.payload;
    },
    clearPermissions: (state) => {
      state.permissions = [];
    },
  },
});

export const { setPermissions, clearPermissions } = permissionSlice.actions;

export default permissionSlice.reducer;
