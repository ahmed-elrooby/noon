import mongoose from "mongoose";

const globalWithMongoose = globalThis;

if (!globalWithMongoose.__mongooseConnection) {
  globalWithMongoose.__mongooseConnection = null;
}

const DbConnect = async () => {
  if (globalWithMongoose.__mongooseConnection) {
    return globalWithMongoose.__mongooseConnection;
  }

  if (!process.env.DB_CONNECTION) {
    throw new Error("DB_CONNECTION is not defined in environment variables");
  }

  try {
    globalWithMongoose.__mongooseConnection = await mongoose.connect(
      process.env.DB_CONNECTION,
      {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 5,
        family: 4,
      },
    );

    console.log("✅ DB Connected");
    return globalWithMongoose.__mongooseConnection;
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    throw err;
  }
};

export default DbConnect;
