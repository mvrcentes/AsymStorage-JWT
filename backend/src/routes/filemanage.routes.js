import { Router } from "express"
import {
  getFiles,
  getFileSignature,
  uploadSignedFile,
} from "../controllers/filemanage/filemanage.controller.js"

const router = Router()

router.post("/upload", uploadSignedFile)
router.get("/files", getFiles)
router.get("/verify/:filename", getFileSignature)

export default router
