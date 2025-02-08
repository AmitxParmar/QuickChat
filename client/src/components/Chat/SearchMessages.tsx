import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

function SearchMessages() {
  const {
    state: { currentChatUser, messages },
    dispatch,
  } = useStateProvider();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMessages, setSearchedMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (searchTerm) {
      // Filter() creates a new array by removing elements don't belong
      // if have search term, filter messages -> get "text" and "includes" msg
      setSearchedMessages(
        messages.filter((message) => {
          return (
            message.type === "text" && message.message.includes(searchTerm)
          );
        })
      );
    } else {
      setSearchedMessages([]);
    }
  }, [searchTerm, messages]);

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen">
      <div className="h-16 px-4 py-5 flex items-center gap-10 bg-panel-header-background text-primary-strong">
        <IoClose
          className="cursor-pointer text-icon-lighter text-2xl"
          onClick={() => dispatch({ type: reducerCases.SET_MESSAGE_SEARCH })}
        />
        <span>Search Messages</span>
      </div>
      <div className="overflow-auto custom-scrollbar h-full">
        <div className="flex items-center flex-col w-full">
          <div className="flex px-5 items-center gap-3 h-14 w-full">
            <div className="bg-panel-header-background flex flex-grow items-center gap-5 px-3 py-1 rounded-lg">
              <div>
                <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
              </div>
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Search messages"
                  className="bg-transparent text-white w-full text-sm focus:outline-none "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <span className="mt-10 text-secondary text-center">
            {!searchTerm.length &&
              `Search for messages with ${
                currentChatUser?.name || "Unknown User"
              }`}
          </span>
        </div>
        <div className="flex justify-center h-full flex-col">
          {searchTerm.length > 0 && !searchedMessages.length && (
            <span className="text-secondary w-full flex justify-center">
              No messages found
            </span>
          )}
          <div className="flex flex-col w-full h-full">
            {searchedMessages.map((message) => (
              <div className="flex w-full px-5 border-b-[0.1px] border-secondary py-5 cursor-pointer flex-col justify-center hover:bg-background-default-hover">
                <div className="text-sm text-secondary">
                  {calculateTime(message.createdAt)}
                </div>
                <div className="text-icon-green">{message.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchMessages;
