import mongoose from "mongoose";

const connect = async () => {
  try {
    console.log("process.env.MONGO_URL: ", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log("DB Connection successful!");
  } catch (error) {
    throw new Error("Error in connecting DB");
  }
};

export default connect;
