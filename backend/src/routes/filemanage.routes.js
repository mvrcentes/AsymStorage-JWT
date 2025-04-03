import { Router } from "express"
import {
  getFiles,
  getFileSignature,
  uploadSignedFile,
  uploadFileWithoutSignature,
} from "../controllers/filemanage/filemanage.controller.js"

const router = Router()

router.post("/upload/sign", uploadSignedFile)
router.post("/upload/unsigned", uploadFileWithoutSignature)
router.get("/files", getFiles)
router.get("/verify/:filename", getFileSignature)

export default router
