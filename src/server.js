import "dotenv/config";
import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";

const PORT = process.env.PORT || 5000;

await connectDb(process.env.MONGO_URI);

const app = createApp();
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
