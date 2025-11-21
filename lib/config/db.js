import mongoose from "mongoose";

export const ConnectDB = async () => {
    await mongoose.connect('mongodb+srv://priyagupta30302_db_user:007007007@cluster0.8jrvhb4.mongodb.net/blog')
    console.log("DB Connected");
}