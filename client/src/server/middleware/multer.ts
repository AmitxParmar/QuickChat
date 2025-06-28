import { RequestHandler } from "express";
import { MsgQuery } from "../types/ServerTypes";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    const date = new Date();
    cb(
      null,
      `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate()}_${file.originalname}`
    );
  },
});

const uploadImage = multer({ storage });

export const uploadImageSingle: RequestHandler<{}, any, any, MsgQuery> =
  uploadImage.single("image") as unknown as RequestHandler<
    {},
    any,
    any,
    MsgQuery
  >;

export const uploadAudioSingle: RequestHandler<{}, any, any, MsgQuery> =
  uploadImage.single("audio") as unknown as RequestHandler<
    {},
    any,
    any,
    MsgQuery
  >;
