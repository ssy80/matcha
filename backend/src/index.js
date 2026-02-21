import express from "express";
import http from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import { swaggerUi, swaggerSpec } from "./swagger/swagger.js";
import { authenticateToken } from "./middlewares/authentication.js";
import { socketAuthenticate } from "./middlewares/socketAuth.js";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { getEventsDb, updateEventStatus } from "./services/eventService.js";


dotenv.config();

const app = express();
const port = process.env.API_HOST_PORT;

// Security middleware
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);
app.use(cors());

app.use("/images", express.static("public/images"));
app.use(express.json({ limit: "5mb" }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/profile", authenticateToken, profileRoutes);
app.use("/api/location", authenticateToken, locationRoutes);
app.use("/api/search", authenticateToken, searchRoutes);
app.use("/api/chat", authenticateToken, chatRoutes);
app.use("/api/event", authenticateToken, eventRoutes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

// 404
app.use((req, res) => {
    res.status(404).json({
      error: "Route not found",
      path: req.originalUrl,
      method: req.method,
    });
});


// Websocket

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "*",
    },
});

app.set("io", io);

io.use(socketAuthenticate);

io.on("connection", async (socket) => {
    const userId = socket.user.id;

    console.log(`User ${userId} connected on ${socket.id}`);

    socket.join(`user_${userId}`);

    socket.activeChatWith = null;

    socket.on("active_chat", (userId) => {
        socket.activeChatWith = userId;
    });

    socket.on("inactive_chat", () => {
        socket.activeChatWith = null;
    });

    try {
        const pendingEvents = await getEventsDb(userId, "new");

        for (const event of pendingEvents) {
            socket.emit("event_created", event);
            await updateEventStatus(event, "delivered");
        }

    } catch (err) {
        console.error("Error delivering pending events:", err);
    }

    socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected from ${socket.id}`);
    });
});


server.listen(port, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
