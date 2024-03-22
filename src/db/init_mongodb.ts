import mongoose from "mongoose";
import config from "../config";

export default (async () => {
  try {
    await mongoose.connect(config.mongodb_url);
    console.log("🛢️ connected to mongodb");
  } catch (error: any) {
    console.log("⚠️ error to connect mongodb", error.message);
  }
})();
