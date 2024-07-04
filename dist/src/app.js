"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const sheersRoutes_1 = __importDefault(require("../royalSheersRoutes/sheersRoutes"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path")); // Add this line to import the 'path' module
// Load environment variables at the top
require('dotenv').config();
const app = (0, express_1.default)();
const port = process.env.PORT;
console.log(port);
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads'))); // Adjust the path for the compiled directory
// CORS configuration
const corsOptions = {
    origin: "https://royal-sheers-backend.onrender.com",
    methods: "OPTIONS, GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization"
};
app.use((0, cors_1.default)(corsOptions));
console.log("Starting the server...");
// Check for MONGO_URI
if (!process.env.MONGO_URL) {
    console.error("MONGO_URL is not defined in the environment variables.");
    process.exit(1); // Exit the process with failure
}
console.log("MONGO_URL:", process.env.MONGO_URL);
// MongoDB connection
mongoose_1.default.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
try {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
catch (error) {
    console.log(error);
}
app.get("/home", (req, res) => {
    res.json({ message: "Hello from Royal Sheers API!" });
});
app.use("/api/v1", sheersRoutes_1.default);
//# sourceMappingURL=app.js.map