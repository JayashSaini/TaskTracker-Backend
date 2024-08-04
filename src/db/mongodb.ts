import mongoose from "mongoose";
export default async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/todo-app"
    );

    console.info(
      "🌏 Mongodb Connecting successfully host : " +
        connectionInstance.connection.host
    );
  } catch (error) {
    console.error("MongoDB conection error : " + error);
    process.exit(1);
  }
}
