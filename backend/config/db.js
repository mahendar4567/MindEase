const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mindease';

  try {
    // Set a 3-second server selection timeout to test local MongoDB availability
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected (Local): ${conn.connection.host}`);
  } catch (primaryError) {
    console.warn(`⚠️ Local MongoDB connection failed (${primaryError.message}). Starting In-Memory MongoDB Server...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
    } catch (memoryError) {
      console.error(`❌ Fatal: MongoDB Connection Error: ${memoryError.message}`);
    }
  }
};

module.exports = connectDB;
