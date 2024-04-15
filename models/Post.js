import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  newUrl: {
    type: String,
    required: true,
  },
});
