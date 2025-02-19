import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import Image from "next/image";
import React from "react";

function IncomingCall() {
  const {
    state: { incomingVoiceCall, socket },
    dispatch,
  } = useStateProvider();

  const acceptCall = () => {
    if (!incomingVoiceCall?.id) return;

    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: { ...incomingVoiceCall, type: "in-coming" },
    });

    socket?.current?.emit("accept-incoming-call", {
      id: incomingVoiceCall.id,
    });

    dispatch({
      type: reducerCases.SET_INCOMING_VOICE_CALL,
      incomingVoiceCall: undefined,
    });
  };

  const rejectCall = () => {
    if (!incomingVoiceCall?.id) return;

    socket?.current?.emit("reject-voice-call", { from: incomingVoiceCall.id });
    dispatch({
      type: reducerCases.END_CALL,
    });
  };

  if (!incomingVoiceCall) return null;

  return (
    <div className="fixed bottom-8 right-6 z-50 w-80 rounded-lg bg-conversation-panel-background shadow-xl border-2 border-icon-green p-4">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Image
            src={incomingVoiceCall.profilePicture || "/default-avatar.png"}
            alt="avatar"
            width={70}
            height={70}
            className="rounded-full"
          />
        </div>
        <div className="flex-1">
          <div className="text-white">
            {incomingVoiceCall.name || "Unknown User"}
          </div>
          <div className="text-xs text-gray-300">Incoming voice call</div>
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

export default IncomingCall;
