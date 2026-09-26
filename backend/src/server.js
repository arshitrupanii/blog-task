import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { db } from "./lib/db.js";
import adminRoutes from "./routes/admin.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/blogs", userRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Blog API is running" });
});


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
  });
}


const startServer = async () => {
  try {
    await db();
    app.listen(port, () => console.log("Server is running on port:", port));
  } catch (error) {
    console.error("Error starting the server", error);
  }
};

startServer();