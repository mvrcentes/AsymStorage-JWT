import { Router } from "express"
import {
  getFiles,
  uploadSignedFile,
} from "../controllers/filemanage/filemanage.controller.js"

const router = Router()

router.post("/upload", uploadSignedFile)
router.get("/files", getFiles)

export default router
