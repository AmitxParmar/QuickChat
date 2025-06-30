import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "@/components/common/MessageStatus";
import ImageMessage from "./ImageMessage";
import { useStateProvider } from "@/context/StateContext";
import VoiceMessage from "./VoiceMessage";
import { useEffect } from "react";
import { reducerCases } from "@/context/constants";

function ChatContainer() {
  const {
    state: { messages, currentChatUser, userInfo, socket },
    dispatch,
  } = useStateProvider();
  // Add this useEffect to handle incoming messages
  useEffect(() => {
    if (socket?.current) {
      const handleIncomingMessage = (data) => {
        console.log("Received message via socket:", data); // Debug log

        // Only add message if it's for the current chat
        if (data.from === currentChatUser?.id || data.to === userInfo?.id) {
          dispatch({
            type: reducerCases.ADD_MESSAGE,
            newMessage: data.message,
            fromSelf: false,
          });
        }
      };

      // Listen for incoming messages
      socket.current.on("msg-receive", handleIncomingMessage);

      // Cleanup
      return () => {
        socket.current?.off("msg-receive", handleIncomingMessage);
      };
    }
  }, [socket, currentChatUser, userInfo, dispatch]);

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      {/* Your existing JSX */}
      <div className="bg-chat-background bg-fixed fixed h-full w-full opacity-5 left-0 top-0 !z-0"></div>
      <div className="mx-10 my-6 relative bottom-0 z-40">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
            {messages?.map((message, index) => (
              <div
                key={message.id + index}
                className={`flex ${
                  message.senderId !== currentChatUser?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.type === "text" && (
                  <div
                    className={`text-white px-4 py-1 text-sm rounded-md flex gap-2 items-end max-w-[45%] ${
                      message.senderId === currentChatUser?.id
                        ? "bg-incoming-background"
                        : "bg-outgoing-background"
                    }`}
                  >
                    <span className="break-all leading-7">
                      {message.message}
                    </span>
                    <div className="flex gap-1 items-end">
                      <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                        {calculateTime(message.createdAt)}
                      </span>
                      <span>
                        {message.senderId === userInfo?.id && (
                          <MessageStatus
                            messageStatus={message.messageStatus}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {message.type === "image" && <ImageMessage message={message} />}
                {message.type === "audio" && <VoiceMessage message={message} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
