import { Socket } from "socket.io-client";

// State types
export interface State {
  userInfo?: IUserProfile | null | undefined;
  newUser?: boolean | undefined;
  contactsPage?: boolean;
  currentChatUser?: IUserProfile | undefined;
  messages: IMessage[];
  contactSearch?: string;
  socket?: React.RefObject<Socket> | null;
  messagesSearch?: boolean;
  userContacts?: IUserProfile[];
  onlineUsers?: string[];
  filteredContacts?: IUserProfile[];

  voiceCall?: ICall | undefined;
  incomingVoiceCall?: ICall | undefined;
}

export interface Action {
  type?: string | undefined;

  userInfo?: IUserProfile;
  user?: IUserProfile;
  newUser?: boolean;
  contactsPage?: boolean;
  currentChatUser?: IUserProfile;
  messages?: IMessage[];
  contactSearch?: string;
  socket?: React.RefObject<Socket> | null;
  messagesSearch?: boolean;
  newMessage?: IMessage;
  userContacts?: IUserProfile[];
  onlineUsers?: [id: string] | [];
  filteredContacts?: IUserProfile[];
  fromSelf?: boolean;

  voiceCall?: ICall | undefined;
  incomingVoiceCall?: undefined;
}
