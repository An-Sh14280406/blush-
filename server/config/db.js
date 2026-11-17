const mongoose = require('mongoose');

let isMongooseConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blush';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongooseConnected = true;
    console.log(`🌸 MongoDB connected successfully: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.log(`🌸 External MongoDB not detected (${err.message}).`);
    console.log(`✨ Activating embedded blush. zero-config persistent store (server/data/blush_db.json)`);
    isMongooseConnected = false;
    return false;
  }
};

const isConnected = () => isMongooseConnected;

module.exports = { connectDB, isConnected };
