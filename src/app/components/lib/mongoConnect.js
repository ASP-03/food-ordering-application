import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGO_URL) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URL"'); // ✅ Fixed mismatch
}

const url = process.env.MONGO_URL;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(url, options);
    await globalWithMongo._mongoClient.connect(); // ✅ Added connection
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(url, options);
  await client.connect(); // ✅ Added connection
}

export default client;
