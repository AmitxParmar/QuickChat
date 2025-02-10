import React, { useState } from "react";
import Avatar from "@/components/common/Avatar";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useStateProvider } from "@/context/StateContext";
import ContextMenu from "../common/ContextMenu";
import { reducerCases } from "@/context/constants";

function ChatHeader() {
  const {
    state: { currentChatUser, onlineUsers },
    dispatch,
  } = useStateProvider();
  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const showContextMenu = (e: React.MouseEvent<SVGAElement>) => {
    e.preventDefault();
    setContextMenuCoordinates({ x: e.pageX - 50, y: e.pageY + 20 });
    setIsContextMenuVisible(true);
  };
  console.log("ONline user", onlineUsers);
  const contextMenuOptions = [
    {
      name: "Exit",
      callback: async () => {
        setIsContextMenuVisible(false);
        dispatch({
          type: reducerCases.SET_EXIT_CHAT,
        });
      },
    },
  ];

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar type="sm" image={currentChatUser?.profilePicture as string} />
        <div className="flex flex-col">
          <span className="text-primary-strong">
            {currentChatUser?.name || "Unknown User"}
          </span>
          <span className="text-secondary text-sm">
            {currentChatUser?.id && onlineUsers?.includes(currentChatUser?.id)
              ? "online"
              : "offline"}
          </span>
        </div>
        <MdCall className="text-panel-header-icon cursor-pointer text-xl" />
        <IoVideocam className="text-panel-header-icon cursor-pointer text-xl" />
        <BiSearchAlt2
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={() => {
            dispatch({ type: reducerCases.SET_MESSAGE_SEARCH });
          }}
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={showContextMenu}
          id="context-opener"
        />
        {isContextMenuVisible && (
          <ContextMenu
            options={contextMenuOptions}
            coordinates={contextMenuCoordinates}
            setContextMenu={setIsContextMenuVisible}
          />
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
