import axios from "axios";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { RootState } from "@/store/store";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
/* import type { Socket } from "socket.io-client"; */
import OutsideClick from "../OutsideClickHandler";
import PhotoPicker from "../common/PhotoPicker";
import { addMessage, setMessages } from "@/store/reducers/chatSlice";
import CaptureAudio from "../common/CaptureAudio";
import { useSocket } from "@/services/socketService";
function MessageBar() {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setEmojiPicker] = useState(false);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const socket = useSocket();

  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const handleEmojiModal = (): void => setEmojiPicker(!showEmojiPicker);
  const handleEmojiClick = (emoji: EmojiClickData) => {
    setMessage((prevMsg) => (prevMsg += emoji.emoji));
  };

  const { userInfo } = useSelector((state: RootState) => state.user);
  const { currentChatUser } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const sendMessage = async () => {
    if (message === "") return console.log("message is empty");
    try {
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message,
      });
      console.log(data, "what does post message returns?? make type outofit");
      socket.emit("send-msg", {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: data.message,
      });
      dispatch(addMessage({ ...data.message }));
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const photoPickerChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0] as Blob;
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo?.id,
          to: currentChatUser?.id,
        },
      });
      if (response.status === 201) {
        dispatch(setMessages({ ...response.data.message }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data?.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  return (
    <div className="bg-panel-header-background h-20 py-12 px-4 flex items-center gap-6 relative ">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Emoji"
            id="emoji-open"
            onClick={handleEmojiModal}
          />
          {showEmojiPicker && (
            <OutsideClick onOutsideClick={handleEmojiModal}>
              <div
                className="absolute bottom-24 left-16 z-40"
                ref={emojiPickerRef}
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            </OutsideClick>
          )}
          <ImAttachment
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Attach File"
            onClick={() => setGrabPhoto(true)}
          />
        </div>
        <div className="w-full rounded-lg h-10 flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </div>
        <div className="flex w-10 items-center justify-center">
          <button className={`${message === "" ? "opacity-20" : null}`}>
            {message.length ? (
              <MdSend
                className="text-panel-header-icon cursor-pointer text-xl"
                title="Send message"
                onClick={() => sendMessage()}
              />
            ) : (
              <FaMicrophone
                className="text-panel-header-icon cursor-pointer text-xl"
                title="Record"
                onClick={() => setShowAudioRecorder(true)}
              />
            )}
          </button>
        </div>
      </>
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
    </div>
  );
}

export default MessageBar;
