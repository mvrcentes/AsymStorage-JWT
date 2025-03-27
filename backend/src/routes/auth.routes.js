import { Router } from "express"

import { register } from "../auth/auth.controller.js"

const router = Router()

router.route("/register").post(register)

export default router
