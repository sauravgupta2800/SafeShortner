import mongoose from "mongoose";

const { Schema } = mongoose;

const PostSchema = new Schema({
  // id: {
  //   type: Number,
  //   required: true,
  //   unique: true,
  // },
  shortPath: {
    type: String,
    required: true,
    unique: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  checkedPasscode: {
    type: Boolean,
    default: false,
  },
  passcode: {
    type: String,
    default: null,
  },
  checkedCaptcha: {
    type: Boolean,
    default: false,
  },
  captcha: {
    type: String,
    default: null,
  },
  checkedExpiry: {
    type: Boolean,
    default: false,
  },
  expireTimezone: {
    type: String,
    default: null,
  },
  expireTime: {
    type: Date,
    default: null,
  },
  checkedControl: {
    type: Boolean,
    default: false,
  },
  blockedCountries: {
    type: [String],
    default: [],
  },
});

export default mongoose.models.PostModel ||
  mongoose.model("PostModel", PostSchema);
