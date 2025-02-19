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
import SearchMessages from "./Chat/SearchMessages";
import VoiceCall from "./Call/VoiceCall";
import VideoCall from "./Call/VideoCall";
import IncomingCall from "./common/IncomingCall";
import IncomingVideoCall from "./common/IncomingVideoCall";

function Main() {
  const router = useRouter();
  const socket = useRef<Socket | null>(null);
  const socketInitialized = useRef(false);

  const { state, dispatch } = useStateProvider();
  const {
    userInfo,
    currentChatUser,
    messagesSearch,
    videoCall,
    voiceCall,
    incomingVoiceCall,
    incomingVideoCall,
  } = state;

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
    if (userInfo && !socketInitialized.current) {
      socket.current = io(HOST, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.current.on("connect", () => {
        console.log("Socket connected successfully");
        socket.current?.emit("add-user", userInfo.id);
        dispatch({ type: reducerCases.SET_SOCKET, socket });
      });

      socket.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socketInitialized.current = true;
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socketInitialized.current = false;
      }
    };
  }, [userInfo]);

  // Handle socket events
  useEffect(() => {
    if (!socket.current || !userInfo) return;

    const handleIncomingVoiceCall = ({ from, roomId, callType }: ICall) => {
      console.log("Incoming voice call received:", { from, roomId, callType });
      if (!voiceCall && !videoCall) {
        // Only handle if not already in a call
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: { ...from, roomId, callType },
        });
      }
    };

    const handleIncomingVideoCall = ({ from, roomId, callType }: ICall) => {
      console.log("Incoming video call received:", { from, roomId, callType });
      if (!voiceCall && !videoCall) {
        // Only handle if not already in a call
        dispatch({
          type: reducerCases.SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: { ...from, roomId, callType },
        });
      }
    };

    // Set up event listeners
    socket.current.on("incoming-voice-call", handleIncomingVoiceCall);
    socket.current.on("incoming-video-call", handleIncomingVideoCall);
    socket.current.on("voice-call-rejected", () => {
      dispatch({ type: reducerCases.END_CALL });
    });
    socket.current.on("video-call-rejected", () => {
      dispatch({ type: reducerCases.END_CALL });
    });

    // Cleanup listeners
    return () => {
      socket.current?.off("incoming-voice-call", handleIncomingVoiceCall);
      socket.current?.off("incoming-video-call", handleIncomingVideoCall);
      socket.current?.off("voice-call-rejected");
      socket.current?.off("video-call-rejected");
    };
  }, [socket.current, userInfo, voiceCall, videoCall]);

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
    <>
      {incomingVideoCall && <IncomingVideoCall />}
      {incomingVoiceCall && <IncomingCall />}
      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall />
        </div>
      )}

      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VoiceCall />
        </div>
      )}
      {!videoCall && !voiceCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden ">
          <ChatList />
          {currentChatUser ? (
            <div className={messagesSearch ? "grid grid-cols-2" : ""}>
              <Chat />
              {messagesSearch && <SearchMessages />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  );
}

export default Main;
