import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connection successful!");
  } catch (error) {
    throw new Error("Error in connecting DB");
  }
};

export default connect;
