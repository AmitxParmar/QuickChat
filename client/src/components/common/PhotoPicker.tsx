import React, { ChangeEvent } from "react";
import { createPortal } from "react-dom";

interface IPhotoPicker {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PhotoPicker: React.FC<IPhotoPicker> = ({ onChange }) => {
  const component = (
    <>
      <input type="file" id="photo-picker" onChange={onChange} />
    </>
  );
  return createPortal(
    component,
    document.getElementById("photo-picker-element") as HTMLElement
  );
};

export default PhotoPicker;
