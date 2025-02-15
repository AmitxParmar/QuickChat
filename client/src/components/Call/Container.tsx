import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";

// Define the stream type for Zego

function Container({ data }: { data: ICall | undefined }) {
  const {
    state: { socket, userInfo },
    dispatch,
  } = useStateProvider();

  const [callAccepted, setCallAccepted] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [zgVar, setZgVar] = useState<ZegoExpressEngine | undefined>(undefined);
  const [localStream, setLocalStream] = useState<MediaStream | undefined>(
    undefined
  );
  const [publishStream, setPublishStream] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (data?.type === "out-going") {
      socket?.current?.on("accept-call", () => {
        setCallAccepted(true);
      });
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [data]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const {
          data: { token: returnedToken },
        } = await axios.get(`${GET_CALL_TOKEN}/${userInfo?.id}`);
        if (returnedToken) setToken(returnedToken);
      } catch (err) {
        console.log(err);
      }
    };
    getToken();
  }, [callAccepted]);

  useEffect(() => {
    const startCall = async () => {
      import("zego-express-engine-webrtc").then(
        async ({ ZegoExpressEngine }) => {
          const appId = Number(process?.env?.NEXT_PUBLIC_ZEGO_APP_ID);
          const serverId = process.env.NEXT_PUBLIC_ZEGO_SERVER_ID;
          if (!appId || !serverId) {
            console.error("Invalid Zego App ID or Server ID");
            return;
          }
          const zg = new ZegoExpressEngine(appId, serverId);
          setZgVar(zg);

          // Use proper types for the roomStreamUpdate event handler
          zg.on("roomStreamUpdate", async (_, updateType, streamList) => {
            if (updateType === "ADD") {
              const rmVideo = document.getElementById("remote-video");
              const vd: HTMLVideoElement | HTMLAudioElement =
                document.createElement(
                  data?.callType === "video" ? "video" : "audio"
                );
              if (streamList[0]) {
                vd.id = streamList[0].streamID;
              }
              vd.autoplay = true;
              vd.muted = false;

              if (data?.callType === "video") {
                (vd as HTMLVideoElement).playsInline = true;
              }

              if (rmVideo) {
                rmVideo.appendChild(vd);
              }
              let stream;
              if (streamList[0]) {
                stream = await zg.startPlayingStream(streamList[0].streamID, {
                  audio: true,
                  video: true,
                });
              }
              if (stream) {
                vd.srcObject = stream;
              }
            } else if (
              updateType === "DELETE" &&
              zg &&
              localStream &&
              streamList[0]?.streamID
            ) {
              zg.destroyStream(localStream);
              zg.stopPublishingStream(streamList[0].streamID);
              zg.logoutRoom(data?.roomId?.toString());
              dispatch({
                type: reducerCases.END_CALL,
              });
            }
          });

          if (!token) {
            throw new Error("Token is required to login to the room.");
          }
          await zg.loginRoom(
            data?.roomId ? data.roomId.toString() : "",
            token as string,
            {
              userID: userInfo?.id ? userInfo.id.toString() : "",
              userName: userInfo?.name || "",
            },
            { userUpdate: true }
          );

          const localStream = await zg.createStream({
            camera: {
              audio: true,
              video: data?.callType === "video",
            },
          });

          const localVideo = document.getElementById("local-audio");
          const videoElement = document.createElement(
            data?.callType === "video" ? "video" : "audio"
          );

          videoElement.id = "video-local-zego";
          videoElement.className = "h-28 w-32";
          videoElement.autoplay = true;
          videoElement.muted = false;
          if (data?.callType === "video") {
            (videoElement as HTMLVideoElement).playsInline = true;
          }

          if (localVideo) {
            localVideo.appendChild(videoElement);
          }

          const td = document.getElementById(
            "video-local-zego"
          ) as HTMLVideoElement | null;
          if (td) {
            td.srcObject = localStream;
          }
          const streamID = "123" + Date.now();
          setPublishStream(streamID);
          setLocalStream(localStream);
          zg.startPublishingStream(streamID, localStream);
        }
      );
    };
    if (token) startCall();
  }, [token !== undefined]);

  const endCall = () => {
    const id = data?.id;
    if (zgVar && localStream && publishStream) {
      if (localStream) {
        zgVar.destroyStream(localStream);
      }
      if (publishStream) {
        zgVar.stopPublishingStream(publishStream);
      }
      if (data?.roomId) {
        zgVar.logoutRoom(data.roomId.toString());
      }
    }
    if (data?.callType === "voice") {
      socket?.current?.emit("reject-voice-call", {
        from: id,
      });
    } else {
      socket?.current?.emit("reject-video-call", {
        from: id,
      });
    }
    dispatch({ type: reducerCases.END_CALL });
  };

  return (
    <div className="border-conversation-panel-background border-1 w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl">{data?.name}</span>
        <span className="text-lg">
          {callAccepted && data?.callType !== "video"
            ? "On going call"
            : "Calling"}
        </span>
      </div>
      {(!callAccepted || data?.callType === "voice") && (
        <div className="my-24">
          <Image
            src={data?.profilePicture as string}
            alt="Avatar"
            height={300}
            width={300}
            className="rounded-full"
          />
        </div>
      )}
      <div className="my-5 relative" id="remote-video">
        <div className="absolute bottom-5 right-5" id="local-audio"></div>
      </div>
      <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
        <MdOutlineCallEnd
          className="text-3xl cursor-pointer"
          onClick={endCall}
        />
      </div>
    </div>
  );
}

export default Container;
