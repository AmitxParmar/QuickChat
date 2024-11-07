type IUserProfile = {
  id?: string;
  name: string | null;
  email: string | null | undefined;
  profilePicture: string | null;
  about?: string | null;
};

type ApiData<T> = {
  data?: T;
  msg?: string;
  status?: boolean;
};

type IMessage = {
  id: string;
  type: "text" | "file" | "image";
  message: string;
  recieverId: string;
  senderId: string;
  messageStatus: "sent" | "delivered" | "read";
  reciever: IUserProfile;
  sender: IUserProfile;
  createdAt: number;
};

interface ChatState {
  currentChatUser: IUserProfile | null | undefined;
  messages: IMessage[] | [];
  addMessage: IMessage | null | undefined;
  socket: unknown | null;
}

interface UserState {
  userInfo: IUserProfile | null;
  newUser: boolean | undefined | null;
  contactsPage: boolean | undefined | null;
}
