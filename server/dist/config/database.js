"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
if (!env_1.MONGO_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.<development/production>.local");
}
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(env_1.MONGO_URI);
        console.log(`✅Connected to MongoDB in ${env_1.NODE_ENV} mode`);
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
exports.default = connectDB;
//Could not find a declaration file for module './env.js'. 'c:/Users/BiGGESt TED/Desktop/ecommerce platform/server/src/config/env.js' implicitly has an 'any' type.
//# sourceMappingURL=database.js.map