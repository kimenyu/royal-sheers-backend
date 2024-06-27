"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const sheersRoutes_1 = __importDefault(require("../royalSheersRoutes/sheersRoutes"));
// import dotenv from 'dotenv';
// Load environment variables at the top
require('dotenv').config();
const app = (0, express_1.default)();
const port = process.env.PORT;
console.log(port);
app.use(express_1.default.json());
// CORS middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
console.log("Starting the server...");
// Check for MONGO_URI
if (!process.env.MONGO_URL) {
    console.error("MONGO_URI is not defined in the environment variables.");
    process.exit(1); // Exit the process with failure
}
console.log("MONGO_URI:", process.env.MONGO_URI);
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
app.use("/api", sheersRoutes_1.default);
//# sourceMappingURL=app.js.map