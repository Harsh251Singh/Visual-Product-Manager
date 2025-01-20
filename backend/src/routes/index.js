import express from "express";
import multer from "multer";
import {
  searchAndStoreSimilarImages,
} from "../controllers/imageController/searchAndStoreSimilarImages.js";
import {
  getUserUploadedImages,
} from "../controllers/imageController/getUserUploadedImages.js";
import {
  register,
  login,
} from "../controllers/auth/authController.js";
import { getSimilarImages } from "../controllers/imageController/getImageResults.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});


router.post("/register", register);
router.post("/login", login);


router.post("/upload", upload.single("image"), searchAndStoreSimilarImages);


router.get("/images", getUserUploadedImages);

router.get("/images/similar/:fileId", getSimilarImages);

export default router;
