import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { swaggerSpec } from "./configs/swagger";
import authRoutes from "./routes/auth.route";
import companyRoutes from "./routes/company.route";
import productRoutes from "./routes/product.route";
import userRoutes from "./routes/user.route";
import sellRoutes from "./routes/sell.route";
import serviceRoutes from "./routes/service.route";
import healthRoutes from "./routes/health.route";

// Middleware
dotenv.config();
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Load Swagger custom CSS
const swaggerCustomCSS = fs.readFileSync(
  path.join(__dirname, "configs", "swagger-styles.css"),
  "utf8"
);

// Swagger API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: swaggerCustomCSS,
    customSiteTitle: "Mobile Repair Shop API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      syntaxHighlight: {
        activate: true,
        theme: "monokai"
      },
      tryItOutEnabled: true,
      docExpansion: "list",
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      displayOperationId: false,
      showExtensions: false,
      showCommonExtensions: false,
    }
  })
);

const PORT = process.env.PORT || 3001;

// ใช้ router ที่ imPORT มา
app.use("/", healthRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", companyRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", sellRoutes);
app.use("/api/v1", serviceRoutes);
app.use("/api/v1/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT} : http://localhost:${PORT}`);
});
