import dotenv from "dotenv";
dotenv.config();
// manage .env file

const config = {
  mongodb_url: process.env.MONGODB_URL || "",
  redis_url: process.env.REDIS_URI || "",
  port: process.env.PORT || 5001,
  prefix: process.env.API_PREFIX || "api",
  access_token_secret: process.env.ACCESS_TOKEN_SECRET || "",
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || "",
  access_token_lifetime: process.env.ACCESS_TOKEN_LIFETIME || "",
  refresh_token_lifetime: process.env.REFRESH_TOKEN_LIFETIME || "",
};

export default config;
