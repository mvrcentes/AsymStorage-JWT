import { Router } from "express"
import { updatePublicKey } from "../controllers/keymanage/keymanage.controller.js"

const router = Router()

router.put("/update-key", updatePublicKey)

export default router
