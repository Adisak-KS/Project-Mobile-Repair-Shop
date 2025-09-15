import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import companyRoutes from "./routes/company.route";
import productRoutes from "./routes/product.route";

// Middleware
dotenv.config();
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;
const API_BASE_PATH = "/api/v1/";

// ใช้ router ที่ import มา
app.use(`${API_BASE_PATH}auth`, authRoutes);
app.use(`${API_BASE_PATH}company`, companyRoutes);
app.use(`${API_BASE_PATH}buy`, productRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port} : http://localhost:${port}`);
});
