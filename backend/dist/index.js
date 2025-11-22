"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const company_route_1 = __importDefault(require("./routes/company.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const sell_route_1 = __importDefault(require("./routes/sell.route"));
const service_route_1 = __importDefault(require("./routes/service.route"));
// Middleware
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 3001;
// ใช้ router ที่ imPORT มา
app.use("/api/v1", auth_route_1.default);
app.use("/api/v1", company_route_1.default);
app.use("/api/v1", product_route_1.default);
app.use("/api/v1", user_route_1.default);
app.use("/api/v1", sell_route_1.default);
app.use("/api/v1", service_route_1.default);
app.use('/api/v1/uploads', express_1.default.static('uploads'));
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT} : http://localhost:${PORT}`);
});
