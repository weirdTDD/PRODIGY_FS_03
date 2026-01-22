
import mongoose from "mongoose";
import { MONGO_URI, NODE_ENV } from "./env";

if (!MONGO_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.<development/production>.local");
}

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI as string);

    console.log(`✅Connected to MongoDB in ${NODE_ENV} mode`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);

    process.exit(1);
  }
}


export default connectDB;

