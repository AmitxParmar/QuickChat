import React from "react";
import Avatar from "../common/Avatar";

import { useDispatch, useSelector } from "react-redux";

import { changeCurrentChatUser } from "@/store/reducers/chatSlice";
import { setContactPage } from "@/store/reducers/userSlice";
import { RootState } from "@/store/store";

interface IChatListItem {
  isContactPage: boolean;
  data: IUserProfile;
}

const ChatListItem = ({ isContactPage = false, data }: IChatListItem) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);

  const handleContactClick = () => {
    if (userInfo?.id !== data.id) {
      dispatch(changeCurrentChatUser(data));
      console.log("the active user cant click");
      dispatch(setContactPage());
    }
  };

  return (
    <div
      className={`flex py-3 cursor-pointer items-center hover:bg-background-default-hover ${
        isContactPage && null
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
