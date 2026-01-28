
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userAuthentication: (state, action) => {
            state.isAuthenticated = action.payload;
        },

        updateUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },

        logoutUser: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
    }
});

export const { userAuthentication, updateUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
