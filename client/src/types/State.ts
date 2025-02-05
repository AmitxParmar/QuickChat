import { Socket } from "socket.io-client";

// State types
export interface State {
  userInfo?: IUserProfile | null | undefined;
  newUser?: boolean | undefined;
  contactsPage?: boolean;
  currentChatUser?: IUserProfile | undefined;
  messages: IMessage[];
  socket?: React.RefObject<Socket> | null;
  messagesSearch?: boolean;
  userContacts?: IUserProfile[] | undefined;
  onlineUsers?: IUserProfile[] | undefined;
  filteredContacts?: IUserProfile[];
}

export interface Action {
  type?: string | undefined;

  userInfo?: IUserProfile;
  user?: IUserProfile;
  newUser?: boolean;
  contactsPage?: boolean;
  currentChatUser?: IUserProfile;
  messages?: IMessage[];
  socket?: React.RefObject<Socket> | null;
  messagesSearch?: boolean;
  newMessage?: IMessage;
  userContacts?: IUserProfile[];
  onlineUsers?: IUserProfile[] | undefined;
  filteredContacts?: IUserProfile[];
  fromSelf?: boolean;
}
