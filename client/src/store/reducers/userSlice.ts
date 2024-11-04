import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: null,
    newUser: null,
    contactsPage: false,
} as UserState;

const mainSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<IUserProfile>) => {
            state.userInfo = action.payload
        },
        setNewUser: (state, action) => {
            state.newUser = action.payload;
        },
        setContactPage: (state) => {
            state.contactsPage = !state.contactsPage;
        },

    },
});

export const {
    setUserInfo,
    setNewUser,
    setContactPage,
} = mainSlice.actions;

export default mainSlice.reducer;