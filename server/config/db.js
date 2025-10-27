// server/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Mongoose 6+ không cần useNewUrlParser và useUnifiedTopology
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

// Handle MongoDB events
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error(`❌ MongoDB error: ${err}`);
});

export default connectDB;
