import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import companyRoutes from "./routes/company.route";
import productRoutes from "./routes/product.route";
import userRoutes from "./routes/user.route";
import sellRoutes from "./routes/sell.route";
import serviceRoutes from "./routes/service.route";

// Middleware
dotenv.config();
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ใช้ router ที่ imPORT มา
app.use("/api/v1", authRoutes);
app.use("/api/v1", companyRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", sellRoutes);
app.use("/api/v1", serviceRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT} : http://localhost:${PORT}`);
});
