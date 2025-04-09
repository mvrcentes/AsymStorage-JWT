import { Router } from "express"
import { getPublicKey, getAllUsersWithKeys } from "../controllers/user/user.controller.js"

const router = Router()

router.get("/public-key", getPublicKey)
router.get("/all-users", getAllUsersWithKeys)

export default router
