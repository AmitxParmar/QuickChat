import { useStateProvider } from "@/context/StateContext";
import React, { useState, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPlay, FaStop } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { HOST } from "@/utils/ApiRoutes";

function VoiceMessage({ message }: { message: IMessage }) {
  const {
    state: { currentChatUser, userInfo },
  } = useStateProvider();
  const [audioMessage, setAudioMessage] = useState<HTMLAudioElement | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number>(0);

  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveform = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    waveform.current = WaveSurfer.create({
      container: waveformRef.current as HTMLElement,
      waveColor: "#ccc",
      progressColor: "#4a9aff",
      cursorColor: "7ae3c3",
      barWidth: 2,
      height: 30,
    });
    waveform.current.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      waveform.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const audioURL = `${HOST}/${message.message}`;
    const audio = new Audio(audioURL);
    setAudioMessage(audio);
    setTimeout(() => {
      waveform.current?.load(audioURL);
    }, 1000);
    waveform.current?.on("ready", () => {
      setTotalDuration(waveform.current?.getDuration() || 0);
    });
  }, [message.message]);

  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
    return () => {}; //Added return statement to handle the case where audioMessage is null
  }, [audioMessage]);

  const formatTime = (time: number): string => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayAudio = () => {
    if (audioMessage) {
      waveform.current?.stop();
      waveform.current?.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  };
  const handlePauseAudio = () => {
    waveform.current?.stop();
    audioMessage?.pause();
    setIsPlaying(false);
  };

  return (
    <>
      <div
        className={`flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-md ${
          message.senderId === currentChatUser?.id
            ? "bg-incoming-background"
            : "bg-outgoing-background"
        }`}
      >
        <div>
          <Avatar type="lg" image={currentChatUser?.profilePicture as string} />
        </div>
        <div className="cursor-pointer text-xl">
          {!isPlaying ? (
            <FaPlay onClick={handlePlayAudio} />
          ) : (
            <FaStop onClick={handlePauseAudio} />
          )}
        </div>
        <div className="relative">
          <div className="w-60" ref={waveformRef}>
            <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
              <span>
                {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
              </span>
              <div className="flex gap-1">
                <span>{calculateTime(message.createdAt)}</span>
                {message.senderId === userInfo?.id && (
                  <MessageStatus messageStatus={message.messageStatus} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VoiceMessage;
