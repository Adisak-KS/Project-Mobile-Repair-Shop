import dotenv from "dotenv";
import startServer from "./app";

// Load env variables
dotenv.config();

const port = process.env.PORT || 3001;

startServer(port);
