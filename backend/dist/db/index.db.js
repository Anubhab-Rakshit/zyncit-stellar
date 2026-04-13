import mongoose from "mongoose";
import { DB_NAME } from "../constants";
const connectDB = async () => {
    try {
        const connectionInstance = (await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)).connection;
        console.log(`\n✅ MongoDB connected! DB HOST: ${connectionInstance.host}`);
    }
    catch (error) {
        console.error("❌ MONGODB connection ERROR:", error);
        process.exit(1); // Exit the process with failure
    }
};
export default connectDB;
