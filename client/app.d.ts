type IUserProfile = {
  id?: string;
  name?: string | null;
  email?: string | null | undefined;
  profilePicture?: string | null;
  about?: string | null;
  senderId?: string;
  receiverId?: string;
};

type ApiData<T> = {
  data?: T;
  msg?: string;
  status?: boolean;
};

type IMessage = {
  id: string;
  type: "text" | "file" | "image" | "audio";
  message: string;
  recieverId: string;
  senderId: string;
  messageStatus: "sent" | "delivered" | "read";
  reciever: IUserProfile;
  sender: IUserProfile;
  createdAt: string;
};
