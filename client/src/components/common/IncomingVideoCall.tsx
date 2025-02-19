import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React from "react";

function IncomingVideoCall() {
  const {
    state: { incomingVideoCall, socket },
    dispatch,
  } = useStateProvider();

  const acceptCall = () => {
    if (!incomingVideoCall?.id) return;

    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: { ...incomingVideoCall, type: "in-coming" },
    });

    socket?.current?.emit("accept-incoming-call", {
      id: incomingVideoCall.id,
    });

    dispatch({
      type: reducerCases.SET_INCOMING_VIDEO_CALL,
      incomingVideoCall: undefined,
    });
  };

  const rejectCall = () => {
    if (!incomingVideoCall?.id) return;

    socket?.current?.emit("reject-video-call", {
      from: incomingVideoCall.id,
    });

    dispatch({
      type: reducerCases.END_CALL,
    });
  };

  if (!incomingVideoCall) return null;

  return (
    <div className="fixed bottom-8 right-6 z-50 w-80 rounded-lg bg-conversation-panel-background shadow-xl border-2 border-icon-green p-4">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Image
            src={incomingVideoCall.profilePicture || "/default-avatar.png"}
            alt="avatar"
            width={70}
            height={70}
            className="rounded-full"
          />
        </div>
        <div className="flex-1">
          <div className="text-white">
            {incomingVideoCall.name || "Unknown User"}
          </div>
          <div className="text-xs text-gray-300">Incoming video call</div>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-red-500 hover:bg-red-600 px-3 py-1 text-sm rounded-full text-white transition-colors"
              onClick={rejectCall}
            >
              Reject
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 px-3 py-1 text-sm rounded-full text-white transition-colors"
              onClick={acceptCall}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomingVideoCall;
