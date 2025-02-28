import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

interface IChatListItem {
  isContactsPage?: boolean;
  data: Partial<IUserProfile> & Partial<IMessage>;
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
          {!isContactsPage && (
            <div>
              <span
                className={`${
                  (data?.totalUnreadMessages || 0) > 0
                    ? "text-icon-green"
                    : "text-secondary"
                } text-sm`}
              >
                {calculateTime(data?.createdAt ?? "")}
              </span>
            </div>
          )}
        </div>
        <div className="flex border-b border-conversation-border pb-2 pt-1 p3-2">
          <div className="flex justify-between w-full">
            <span className="text-secondary line-clamp-1 text-sm">
              {isContactsPage ? (
                data?.about || "\u00A0"
              ) : (
                <div
                  className="
                flex items-center gap-1 max-w-[200px]
                sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]
                "
                >
                  {data.senderId === userInfo?.id && (
                    <MessageStatus
                      messageStatus={data?.messageStatus || "sent"}
                    />
                  )}
                  {data.type === "text" && (
                    <span className="truncate">{data.message}</span>
                  )}
                  {data.type === "audio" && (
                    <span className="flex gap-1 items-center">
                      <FaMicrophone className="text-panel-header-icon" /> Audio
                    </span>
                  )}
                  {data.type === "image" && (
                    <span className="flex gap-1 items-center">
                      <FaCamera className="text-panel-header-icon" /> Image
                    </span>
                  )}
                </div>
              )}
            </span>
            <span>
              {(data.totalUnreadMessages || 0) > 0 && (
                <span className="bg-icon-green px-[5px] rounded-full text-sm">
                  {data.totalUnreadMessages}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
