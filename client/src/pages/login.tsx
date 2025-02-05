import { useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

import { auth } from "@/utils/FirebaseConfig";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";

import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function login() {
  const router = useRouter();

  const {
    state: { userInfo, newUser },
    dispatch,
  } = useStateProvider();

  useEffect(() => {
    if (userInfo?.id && !newUser) router.push("/");
  }, [userInfo, newUser]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName: name, email: email, photoURL: profilePicture },
    } = await signInWithPopup(auth, provider);
    try {
      // Call API from utils/ApiRoutes.js
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email });
        if (!data.status) {
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: true,
          });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: { name, email, profilePicture, about: "" },
          });

          router.push("/onboarding");
        } else if (data.status) {
          const { id, email, name, profilePicture, about } = data.data;
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: false,
          });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: { id, name, email, profilePicture, about },
          });
          router.push("/");
        }
      }
    } catch (e) {
      console.log(e);
    }

    // console.log({ user }) // Get display name, email, and profile photo URL
  };

  return (
    <div className="h-screen w-screen gap-6 flex flex-col justify-center items-center bg-panel-header-background">
      <div className="flex items-center justify-center gap-2 text-white">
        <Image src="/whatsapp.gif" alt="whatsapp" height={300} width={300} />
        <span className="text-7xl">Whatsapp</span>
      </div>
      <button
        className="flex items-center  justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
        onClick={handleLogin}
      >
        <FcGoogle />
        <span className="text-white text-2xl">Login with Google</span>
      </button>
    </div>
  );
}

export default login;
