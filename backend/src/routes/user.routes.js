import { Router } from "express"
import { getPublicKey } from "../controllers/user/user.controller.js"

const router = Router()

router.get("/public-key", getPublicKey)

export default router
