type IUserProfile = {
  id?: string;
  name?: string | null;
  email?: string | null | undefined;
  profilePicture?: string | null;
  about?: string | null;
  senderId?: string;
  receiverId?: string;
  totalUnreadMessages?: number;
  createdAt?: string | undefined;
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
  receiverId: string;
  senderId: string;
  messageStatus: "sent" | "delivered" | "read";
  receiver: IUserProfile;
  sender: IUserProfile;
  createdAt: string;
};

type Contact = {
  [initialLetter: string]: IUserProfile[];
};

interface ICall extends IUserProfile {
  from?: string;
  roomId?: string;
  callType?: "voice" | "video";
  type?: string;
}
