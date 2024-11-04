import { useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

import { auth } from "@/utils/FirebaseConfig";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useDispatch, useSelector } from "react-redux";
import { setNewUser, setUserInfo } from "@/store/reducers/userSlice";
import { RootState } from "@/store/store";

function login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { userInfo, newUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (userInfo?.id && !newUser) router.push("/");
  }, [userInfo, newUser]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName: name, email, photoURL: profilePicture },
    } = await signInWithPopup(auth, provider);
    try {
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, {
          email,
        });

        if (!data.status) {
          dispatch(setNewUser(true));
          dispatch(setUserInfo({ name, email, profilePicture, about: "" }));
          router.push("/onboarding");
        } else {
          const { id, name, email, profilePicture, about } =
            data as IUserProfile;
          dispatch(setUserInfo({ id, name, email, profilePicture, about }));
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
    }
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
