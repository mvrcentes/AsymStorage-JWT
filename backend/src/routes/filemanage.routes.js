import { Router } from "express"
import { uploadSignedFile } from "../controllers/filemanage/filemanage.controller.js"

const router = Router()

router.post("/upload", uploadSignedFile)

export default router