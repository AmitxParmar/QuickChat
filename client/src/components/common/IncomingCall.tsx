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
    if (incomingVoiceCall?.id) {
      dispatch({
        type: reducerCases.SET_VOICE_CALL,
        voiceCall: { ...incomingVoiceCall, type: "in-coming" },
      });
    }

    socket?.current?.emit("accept-incoming-call", {
      id: incomingVoiceCall?.id,
    });

    dispatch({
      type: reducerCases.SET_INCOMING_VOICE_CALL,
      incomingVoiceCall: undefined,
    });
  };

  const rejectCall = () => {
    dispatch({
      type: reducerCases.END_CALL,
    });
    socket?.current?.emit("reject-voice-call", { from: incomingVoiceCall.id });
  };

  return (
    <div className="h-24 w-80 fixed bottom-8 right-6 mb-0 z-50 rounded-sm flex gap-5 items-center justify-start text-white p-4 bg-conversation-panel-background drops-shadow-2xl border-2 border-icon-green py-14">
      <div>
        <Image
          src={incomingVoiceCall?.profilePicture as string}
          alt="avatar"
          width={70}
          height={70}
          className="rounded-full"
        />
      </div>
      <div>
        <div>{incomingVoiceCall?.name}</div>
        <div className="text-xs">Incoming call</div>
        <div className="flex gap-2 mt-2">
          <button
            className="bg-red-500 p-1 px-3 text-sm rounded-full"
            onClick={rejectCall}
          >
            Reject
          </button>
          <button
            className="bg-green-500 p-1 px-3 text-sm rounded-full"
            onClick={acceptCall}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingCall;
