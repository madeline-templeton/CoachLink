import "dotenv/config";
import express from "express";
import cors from "cors";
import userHandlers from "./handlers/users.js";
import sessionsHandlers from "./handlers/sessions.js";
import realtimeHandlers from "./handlers/realtime.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", userHandlers);
app.use("/rtdb", realtimeHandlers);
app.use("/sessions", sessionsHandlers);

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
const server = app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

server.on("error", (err: any) => {
  if (err && err.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Set PORT to a different value (e.g., 8081) and retry.`,
    );
  } else {
    console.error("Server error:", err);
  }
});
