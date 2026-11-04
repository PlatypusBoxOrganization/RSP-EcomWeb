import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    // Non-fatal: the API still starts (routes fall back to mock data when the DB is unreachable).
    console.error(`MongoDB connection failed (continuing without DB): ${error.message}`.yellow.underline);
  }
};

export default connectDB;
