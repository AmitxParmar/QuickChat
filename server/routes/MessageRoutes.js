import { Router } from "express";
import {
  addMessage,
  getMessage,
  addImageMessage,
} from "../controllers/MessageController.js";
import multer from "multer";

const router = Router();

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

router.post("/add-message", addMessage);
router.get("/get-messages/:from/:to", getMessage);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);

export default router;
