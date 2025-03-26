// Global dependencies
import cors from "cors";
import express from "express";

// Project dependencies
import "./database.js";
import { errorHandler } from "./middleware/erros.js";

// Express initialization
const app = express();

const corsOptions = {
	origin: "http://localhost:3000",
	credentials: true,
};

app.set("port", process.env.PORT || 5000);

app.use(cors(corsOptions));
app.use((req, res, next) => {
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});

// Middlewares
app.use(express.json());

// Routes
app.get("/", (req, res) => {
	res.send("Hello world");
});

// Error handler
app.use(errorHandler);

export default app;
