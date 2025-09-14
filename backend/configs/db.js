import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Mongoose will use the MONGO_URI from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit the process with a failure code
    process.exit(1);
  }
};

export default connectDB;