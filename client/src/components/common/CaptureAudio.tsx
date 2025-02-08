"use client";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaPause,
  FaTrash,
} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

interface ICaptureAudio {
  hide: Dispatch<SetStateAction<boolean>>;
}

function CaptureAudio({ hide }: ICaptureAudio) {
  const {
    state: { userInfo, currentChatUser, socket },
    dispatch,
  } = useStateProvider();

  // States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudio, setRecordedAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState<File | null>(null);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000); // Added interval time of 1000ms (1 second)
    }
    return () => {
      clearInterval(interval!);
    };
  }, [isRecording]); // Handle Recording updates

  useEffect(() => {
    if (waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
      });
      setWaveform(wavesurfer);
      wavesurfer.on("finish", () => setIsPlaying(false));
      return () => wavesurfer.destroy();
    }
    //Added return statement to handle the case where waveformRef.current is null
    return () => {};
  }, [waveformRef]); // Handle Waveform instance

  useEffect(() => {
    if (waveform) handleStartRecording();
  }, [waveform]);

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudio(null);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        if (audioRef.current) {
          audioRef.current.srcObject = stream;
        }

        const chunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);
          setRecordedAudio(audio);

          waveform?.load(audioURL);
        };
        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Recording Start Error: ", error.message.includes("Requested device not found") ? "Microphone not found. Please check your device settings." : error);
      });
  };

  const handleStopRecording = () => {
    console.log("handle stop triggered");
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveform?.stop();

      const audioChunks: BlobPart[] = [];
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        (event: BlobEvent) => {
          audioChunks.push(event.data);
        }
      );

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRenderedAudio(audioFile);
      });
    } else {
      console.error("No recording in progress to stop.");
    }
  };

  useEffect(() => {
    const updatePlaybackTime = () => {
      if (recordedAudio) {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      }
    };
    if (recordedAudio) {
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
    }
    return () => {
      if (recordedAudio) {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      }
    };
  }, [recordedAudio]);

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveform?.stop();
      waveform?.play();
      recordedAudio.play();
      setIsPlaying(true);
      recordedAudio.onended = () => setIsPlaying(false); // Reset isPlaying when audio ends
    }
  };

  const handlePauseRecording = () => {
    console.log("handle pause triggered");
    if (recordedAudio) {
      waveform?.stop();
      recordedAudio.pause();
      setIsPlaying(false);
    } else {
      console.error("No audio to pause.");
    }
  };

  const sendRecording = async () => {
    try {
      if (!renderedAudio) {
        console.error("No audio file to send. Please record audio first.");
        return; // Exit if renderedAudio is null
      }

      let formData = new FormData();
      formData.append("audio", renderedAudio); // Now this is safe

      // Post data with Multipart form data
      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo?.id,
          to: currentChatUser?.id,
        },
      });

      if (response.status === 201) {
        socket?.current?.emit("send-msg", {
          message: response.data.message,
          to: currentChatUser?.id,
          from: userInfo?.id,
        });

        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-end items-center text-2xl w-full">
      <div className="pt-1">
        <FaTrash
          className="text-panel-header-icon"
          onClick={() => hide(false)}
        />
      </div>
      <div className="mx-4 px-4 py-2 text-white text-lg flex justify-center items-center gap-3 bg-search-input-container-background rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-500 animate-pulse 2-60 text-center">
            Recording <span>{recordingDuration}</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaPause onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveformRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />

        <div className="mr-4">
          {!isRecording ? (
            <FaMicrophone
              className="text-red-500"
              onClick={handleStartRecording}
            />
          ) : (
            <FaPauseCircle
              className="text-red-500"
              onClick={handleStopRecording}
            />
          )}
        </div>
        <div>
          <MdSend
            className="text-panel-header-icon cursor-pointer mr-4"
            title="Send"
            onClick={sendRecording}
          />
        </div>
      </div>
    </div>
  );
}

export default CaptureAudio;
