import { State, Action } from "@/types/State";
import { reducerCases } from "./constants";

export const initialState: State = {
  userInfo: null,
  newUser: false,
  contactsPage: false,
  currentChatUser: undefined,
  messages: [],
  socket: null,
  messagesSearch: false,
  userContacts: [],
  onlineUsers: [],
  filteredContacts: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case reducerCases.SET_USER_INFO:
      return {
        ...state,
        userInfo: action.userInfo,
      };
    case reducerCases.SET_NEW_USER:
      return {
        ...state,
        newUser: action.newUser,
      };
    case reducerCases.SET_ALL_CONTACTS_PAGE:
      return {
        ...state,
        contactsPage: !state.contactsPage,
      };
    case reducerCases.CHANGE_CURRENT_CHAT_USER:
      return {
        ...state,
        currentChatUser: action.user,
      };
    case reducerCases.SET_MESSAGES:
      return {
        ...state,
        messages: action.messages || [],
      };
    case reducerCases.SET_SOCKET:
      return {
        ...state,
        socket: action.socket,
      };
    case reducerCases.ADD_MESSAGE:
      return {
        ...state,
        messages: action.newMessage
          ? [...state.messages, action.newMessage]
          : state.messages,
      };
    case reducerCases.SET_MESSAGE_SEARCH:
      return {
        ...state,
        messagesSearch: !state.messagesSearch,
      };
    case reducerCases.SET_USER_CONTACTS:
      return {
        ...state,
        userContacts: action.userContacts,
      };
    case reducerCases.SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.onlineUsers,
      };
    case reducerCases.SET_CONTACT_SEARCH:
      const filteredContacts = state?.userContacts?.filter((contact) =>
        contact?.name
          ?.toLowerCase()
          .includes(action?.contactSearch?.toLowerCase() || "")
      );
      return {
        ...state,
        contactSearch: action.contactSearch,
        filteredContacts,
      };
    case reducerCases.SET_EXIT_CHAT: {
      return {
        ...state,
        currentChatUser: undefined,
      };
    }
    default:
      return state;
  }
};

export default reducer;
