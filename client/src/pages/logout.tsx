import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { auth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function logout() {
  const {
    state: { socket, userInfo },
    dispatch,
  } = useStateProvider();
  const router = useRouter();
  useEffect(() => {
    if (socket?.current) {
      socket.current.emit("sign-out", userInfo?.id);
    }
    dispatch({
      type: reducerCases.SET_USER_INFO,
      userInfo: undefined,
    });
    signOut(auth);
    router.push("/login");
  }, [socket]);
  return <div className="bg-conversation-panel-background"></div>;
}

export default logout;
