import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import Chat from "./Chat/Chat";
import { auth } from "@/utils/FirebaseConfig";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { type Socket, io } from "socket.io-client";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function Main() {
  const router = useRouter();
  const socket = useRef<Socket | null>(null);

  const { state, dispatch } = useStateProvider();
  const { userInfo, currentChatUser } = state;

  const [redirectLogin, setRedirectLogin] = useState<boolean>(false);
  const [socketEvent, setSocketEvent] = useState<boolean>(false);

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  // handle get chat messages //
  useEffect(() => {
    const getMessages = async () => {
      const { data: messages } = await axios.get<IMessage[]>(
        `${GET_MESSAGES_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`
      );
      dispatch({
        type: reducerCases.SET_MESSAGES,
        messages: messages,
      });
    };
    if (currentChatUser?.id && userInfo?.id) {
      getMessages();
    }
  }, [currentChatUser]);

  // initialize socket //
  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({ type: reducerCases.SET_SOCKET, socket });
    }
  }, [userInfo]);

  // Handle socket events
  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("receive-msg", (data) => {
        console.log(data, "new message received using socket data");
        if (data) {
          dispatch({
            type: reducerCases.ADD_MESSAGE,
            newMessage: {
              ...data.message,
            },
          });
        }
      });
      socket.current.on("online-users", ({ onlineUsers }) => {
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers,
        });
      });
      setSocketEvent(true);
    }
  }, [socket.current]);

  onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) {
      return setRedirectLogin(true);
    }
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser.email,
      });

      if (!data.status) {
        return setRedirectLogin(true);
      } else {
        const {
          id,
          name,
          email,
          profilePicture: profilePicture,
          about,
        } = data.data;

        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id,
            name,
            email,
            profilePicture,
            about,
          },
        });
      }
    }
  });

  return (
    <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
      {<ChatList />}

      {currentChatUser ? <Chat /> : <Empty />}
    </div>
  );
}

export default Main;
