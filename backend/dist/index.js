import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userHandlers from "./handlers/users";
import realtimeHandlers from "./handlers/realtime";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/users", userHandlers);
app.use("/rtdb", realtimeHandlers);
const port = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
