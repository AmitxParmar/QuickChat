import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { type Socket } from "socket.io-client";


const initialState = {
    currentChatUser: null,
    messages: [],
    /* socket: null as (Socket | null) */
} as (ChatState)

const chat = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        changeCurrentChatUser: (state, action) => {
            state.currentChatUser = action.payload;
        },
        setMessages: (state, action: PayloadAction<IMessage[]>) => {
            state.messages = action.payload;
        },
       /*  setSocket: (state, action) => {
            state.socket = action.payload;
        }, */
        addMessage: (state, action: PayloadAction<IMessage>) => {
            state.messages = [...state?.messages, action.payload]
        }
    }
})

export const {
    changeCurrentChatUser,
    setMessages,
    /* setSocket, */
    addMessage
} = chat.actions;

export default chat.reducer;