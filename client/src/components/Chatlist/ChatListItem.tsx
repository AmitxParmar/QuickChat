import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

interface IChatListItem {
  isContactsPage: boolean;
  data: IUserProfile;
}

const ChatListItem = ({ isContactsPage = false, data }: IChatListItem) => {
  const {
    state: { userInfo },
    dispatch,
  } = useStateProvider();

  const handleContactClick = () => {
    if (!isContactsPage) {
      dispatch({
        type: reducerCases.CHANGE_CURRENT_CHAT_USER,
        user: {
          name: data.name,
          about: data.about,
          profilePicture: data.profilePicture,
          email: data.email,
          id: userInfo?.id === data.senderId ? data.receiverId : data.senderId,
        },
      });
    } else {
      dispatch({
        type: reducerCases.CHANGE_CURRENT_CHAT_USER,
        user: { ...data },
      });
      dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
    }
  };
  return (
    <div
      className={`flex py-3 cursor-pointer items-center hover:bg-background-default-hover ${
        isContactsPage && null
      }`}
      onClick={() => handleContactClick()}
    >
      <div className="min-w-fit px-5  pb-1">
        <Avatar type="lg" image={data?.profilePicture as string} />
      </div>
      <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
        <div className="flex justify-between">
          <div>
            <span className="text-white">{data?.name}</span>
          </div>
        </div>
        <div className="flex border-b border-conversation-border pb-2 pt-1 p3-2">
          <div className="flex justify-between w-full">
            <span className="text-secondary line-clamp-1 text-sm">
              {data?.about || "\u00A0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
