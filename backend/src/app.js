// Global dependencies
import cors from "cors"
import express from "express"
import fileUpload from "express-fileupload"

// Project dependencies
import "./database.js"
import { errorHandler } from "./middleware/erros.js"

import authRoutes from "./routes/auth.routes.js"
import filemanageRoutes from "./routes/filemanage.routes.js"
import keymanageRoutes from "./routes/keymanage.routes.js"
import userRoutes from "./routes/user.routes.js"

// Express initialization
const app = express()

const corsOptions = {
  origin: true,
  credentials: true,
}

app.set("port", process.env.PORT || 5000)

app.use(cors(corsOptions))
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
    return res.status(200).json({})
  }
  next()
})

// Middlewares
app.use(express.json())
app.use(fileUpload())

// Routes
app.get("/", (req, res) => {
  res.send("Hello world")
})
app.use("/api/auth", authRoutes)
app.use("/api/keymanage", keymanageRoutes)
app.use("/api/files", filemanageRoutes)
app.use("/api/user", userRoutes)

// Error handler
app.use(errorHandler)

export default app
