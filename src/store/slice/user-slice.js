import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: {}
    },
    reducers: {
        updateUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        clearUserInfo: (state, action) => {
            state.userInfo = {};
        }
    }
});

export const { updateUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;