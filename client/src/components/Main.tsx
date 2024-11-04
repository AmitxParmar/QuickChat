import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";

import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import Chat from "./Chat/Chat";

import { auth } from "@/utils/FirebaseConfig";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { setUserInfo } from "@/store/reducers/userSlice";
import { setMessages, addMessage } from "@/store/reducers/chatSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { useSocket } from "@/services/socketService";

function Main() {
  /* const socket = useRef<Socket | null>(null); */
  const router = useRouter();
  const [socketEvent, setSocketEvent] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { currentChatUser } = useSelector((state: RootState) => state.chat);
  const socket = useSocket();

  const dispatch = useDispatch<AppDispatch>();

  const [redirectLogin, setRedirectLogin] = useState<boolean>(false);

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) setRedirectLogin(true);
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser.email,
      });
      console.log(data, "userCheckData main");
      if (!data.status) {
        router.push("/login");
      }
      if (data?.data) {
        console.log("settttings userINfo testtttttttttt", data.data);
        dispatch(setUserInfo(data.data));
      }
    }
  });

  useEffect(() => {
    if (userInfo) {
      /* socket.current = io(HOST); */
      socket.emit("add-user", userInfo.id);
      /* dispatch(setSocket(socket.current)); */
      console.log(socket, "socket for types");
    }
  }, [userInfo]);

  useEffect(() => {
    if (socket && !socketEvent) {
      socket.on("msg-recieve", (data) => {
        console.log(data, "new message received using socket data");
        dispatch(addMessage({ ...data.message }));
      });
      setSocketEvent(true);
    }
  }, [socket]);

  useEffect(() => {
    const getMessages = async () => {
      const { data: messages } = await axios.get<IMessage[]>(
        `${GET_MESSAGES_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`
      );
      dispatch(setMessages(messages));
    };
    console.log(`${GET_MESSAGES_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`);
    console.log(
      currentChatUser?.id && userInfo?.id,
      "current user id the run the getMessage"
    );
    if (currentChatUser?.id && userInfo?.id) {
      getMessages();
    }
    console.log("useEffect getMessages triggered");
  }, [currentChatUser]);

  return (
    <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
      <ChatList />
      {void console.log("currentChatList", currentChatUser)}
      {currentChatUser ? <Chat /> : <Empty />}
    </div>
  );
}

export default Main;
