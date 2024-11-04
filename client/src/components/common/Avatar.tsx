import Image from "next/image";
import React, {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { FaCamera } from "react-icons/fa";

import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

interface IAvatar {
  type: "sm" | "lg" | "xl";
  image: string;
  setImage?: Dispatch<SetStateAction<string>> | undefined;
}

const Avatar: React.FC<IAvatar> = ({ type, image, setImage }) => {
  const [hover, setHover] = useState<boolean>(false);
  const [grabPhoto, setGrabPhoto] = useState<boolean>(false);
  const [showPhotoLibrary, setShowPhotoLibrary] = useState<boolean>(false);
  const [showCapturePhoto, setShowCapturePhoto] = useState<boolean>(false);

  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });
  const showContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenuCordinates({
      x: e.pageX,
      y: e.pageY,
    });
    setIsContextMenuVisible(true);
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

  const contextMenuOptions = [
    {
      name: "Take Photo",
      callback: () => {
        setShowCapturePhoto(true);
      },
    },
    {
      name: "Choose From Library",
      callback: () => {
        setShowPhotoLibrary(true);
      },
    },
    {
      name: "Upload Photo",
      callback: () => {
        setGrabPhoto(true);
      },
    },
    {
      name: "Remove Photo",
      callback: () => {
        setImage?.("/default_avatar.png");
      },
    },
  ];

  const photoPickerChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] as File;
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = function (event: ProgressEvent<FileReader>) {
      data.src = event?.target?.result as string;
      data.setAttribute("data-src", event?.target?.result as string);
    };
    reader.readAsDataURL(file);
    setTimeout(() => {
      setImage?.(data?.src);
    }, 100);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <div className="relative h-10 w-10">
            <Image
              src={image ? image : "/default_avatar.png"}
              alt="avatar"
              className="rounded-full"
              fill
            />
          </div>
        )}
        {type === "lg" && (
          <div className="relative h-14 w-14">
            <Image src={image? image : "/default_avatar.png"} alt="avatar" className="rounded-full" fill />
          </div>
        )}
        {type === "xl" && (
          <div
            className="relative cursor-pointer z-0"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              className={`z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2 ${
                hover ? "visible" : "hidden"
              }`}
              onClick={(e) => showContextMenu(e)}
            >
              <FaCamera className="text-2xl" id="context-opener" />
              <span>Change Profile Photo</span>
            </div>
            <div className="h-60 w-60">
              <Image src={image} alt="avatar" className="rounded-full" fill />
            </div>
          </div>
        )}
      </div>

      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          cordinates={contextMenuCordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
      {showPhotoLibrary && (
        <PhotoLibrary
          setImage={setImage}
          hidePhotoLibrary={setShowPhotoLibrary}
        />
      )}
      {showCapturePhoto && (
        <CapturePhoto setImage={setImage} hide={setShowCapturePhoto} />
      )}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </>
  );
};

export default Avatar;
