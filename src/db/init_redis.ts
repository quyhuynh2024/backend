import { RedisClientType, createClient } from "redis";
import config from "../config";

const client: RedisClientType = createClient({ url: config.redis_url });

(async () => {
  try {
    await client.connect();
    console.log("🛢️ connected to redis database");
  } catch (error: any) {
    console.log("⚠️ error to connect redis database", error.message);
    throw Error(error);
  }
})();

export default client;
