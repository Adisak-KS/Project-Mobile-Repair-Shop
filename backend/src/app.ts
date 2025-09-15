import express from "express";
import morgan from "morgan";
import cors from "cors";
import loadAllRoutes from "./routes";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const API_BASE_PATH = "/api/v1";

async function startServer(port: number | string) {
  const allRoutes = await loadAllRoutes();
  app.use(API_BASE_PATH, allRoutes);

  app.listen(port, () => {
    console.log(`✅ Server is running on port ${port} : http://localhost:${port}`);
  });
}

export default startServer;
