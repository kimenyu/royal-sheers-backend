import express, { Request, Response, NextFunction } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import router from "../royalSheersRoutes/sheersRoutes";
import cors from "cors";
import path from "path"; // Add this line to import the 'path' module

// Load environment variables at the top
require('dotenv').config();

const app = express();
const port = process.env.PORT;
console.log(port);

app.use(express.json());
app.use('/dist/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images

// CORS configuration
const corsOptions = {
  origin: "https://royal-sheers-backend.onrender.com",
  methods: "OPTIONS, GET, POST, PUT, PATCH, DELETE",
  allowedHeaders: "Content-Type, Authorization"
};

app.use(cors(corsOptions));

console.log("Starting the server...");

// Check for MONGO_URI
if (!process.env.MONGO_URL) {
  console.error("MONGO_URL is not defined in the environment variables.");
  process.exit(1); // Exit the process with failure
}

console.log("MONGO_URL:", process.env.MONGO_URL);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

try {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} catch (error) {
  console.log(error);
}

app.get("/home", (req, res) => {
  res.json({ message: "Hello from Royal Sheers API!" });
});

app.use("/api/v1", router);
