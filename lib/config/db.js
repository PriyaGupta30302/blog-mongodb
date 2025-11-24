import mongoose from "mongoose";

export const ConnectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not defined");
  await mongoose.connect(uri);
  console.log("DB Connected");
};
