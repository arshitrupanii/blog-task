import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { db } from "./lib/db.js";
import adminRoutes from "./routes/admin.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/blogs", userRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Blog API is running" });
});

if (!process.env.VERCEL) {
  await db();
  app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
  });
} else {
  await db();
}

export default app;
