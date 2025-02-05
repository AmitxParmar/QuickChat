import Avatar from "../common/Avatar";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/FirebaseConfig";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function ChatListHeader() {
  const {
    state: { userInfo },
    dispatch,
  } = useStateProvider();

  const handleAllContactsPage = () => {
    dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
  };

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer" onClick={() => void signOut(auth)}>
        <Avatar type="sm" image={userInfo?.profilePicture as string} />
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
          onClick={() => handleAllContactsPage()}
        />
        <>
          <BsThreeDotsVertical
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Menu"
          />
        </>
      </div>
    </div>
  );
}

export default ChatListHeader;
