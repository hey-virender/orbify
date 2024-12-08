import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Check if the MONGODB_URI is defined
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Function to connect to the MongoDB database
async function dbConnect() {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return; // Already connected
  }

  // Connect to the database
  try {
    await mongoose.connect(MONGODB_URI);
    
  } catch (error) {
   
    throw new Error("Failed to connect to the database");
  }
}

export default dbConnect;
