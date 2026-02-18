import express from "express";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js"
import locationRoutes from "./routes/locationRoutes.js"
import { swaggerUi, swaggerSpec } from "./swagger/swagger.js";
import { authenticateToken } from "./middlewares/authentication.js";
import searchRoutes from "./routes/searchRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";


dotenv.config();

const app = express();
const port = process.env.API_HOST_PORT;

// Security middleware
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);
app.use(cors({
    origin: true,
    credentials: true,
}));

// static images dir
app.use("/images", express.static("public/images"));

// Limit 5mb
app.use(express.json({ limit: "5mb" }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/profile", authenticateToken, profileRoutes);
app.use("/api/location", authenticateToken, locationRoutes);
app.use("/api/search", authenticateToken, searchRoutes);
app.use("/api/chat", authenticateToken, chatRoutes);
app.use("/api/event", authenticateToken, eventRoutes);


// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});


// 404 handler (after all routes)
app.use((req, res) => {
    res.status(404).json({ 
        error: "Route not found",
        path: req.originalUrl,
        method: req.method
    });
});


// Start the server
app.listen(port, "0.0.0.0", () => {
    console.log(`Express app listening at http://0.0.0.0:${port}`);
});
