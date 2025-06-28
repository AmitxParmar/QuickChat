import { Router } from "express";
import {
  addMessage,
  getMessage,
  addImageMessage,
  addAudioMessage,
  getInitialContactswithMessages,
} from "../controllers/MessageController";
import { MsgQuery } from "../types/ServerTypes";
import { uploadAudioSingle, uploadImageSingle } from "../middleware/multer";

const router = Router();

router.post("/add-message", addMessage);
router.get("/get-messages/:from/:to", getMessage);
router.post(
  "/add-image-message",
  uploadImageSingle, // query typed as MsgQuery
  addImageMessage
);
router.post<{}, any, any, MsgQuery>(
  "/add-audio-message",
  uploadAudioSingle,
  addAudioMessage
);
router.get("/get-initial-contact/:from", getInitialContactswithMessages);

export default router;
