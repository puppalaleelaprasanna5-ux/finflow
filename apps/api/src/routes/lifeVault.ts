import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createLifeVaultDocument,
  deleteLifeVaultDocument,
  listLifeVaultDocuments,
} from "../controllers/lifeVaultController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
const uploadsDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname || "");
      cb(null, `${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.use(authenticate);
router.get("/", listLifeVaultDocuments);
router.post("/", upload.single("file"), createLifeVaultDocument);
router.delete("/:id", deleteLifeVaultDocument);

export default router;
