"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Authentication Middleware
 * ตรวจสอบ JWT token จาก Authorization header
 */
const authenticate = async (req, res, next) => {
    const requestId = (0, uuid_1.v4)();
    req.requestId = requestId;
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "No token provided",
                meta: {
                    timestamp: new Date().toISOString(),
                    endpoint: req.originalUrl,
                    requestId,
                },
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Invalid token format",
                meta: {
                    timestamp: new Date().toISOString(),
                    endpoint: req.originalUrl,
                    requestId,
                },
            });
        }
        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined in environment variables");
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        // Attach user info to request
        req.user = {
            id: decoded.id,
            level: decoded.level,
        };
        next();
    }
    catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Invalid token",
                meta: {
                    timestamp: new Date().toISOString(),
                    endpoint: req.originalUrl,
                    requestId,
                },
            });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "Token expired",
                meta: {
                    timestamp: new Date().toISOString(),
                    endpoint: req.originalUrl,
                    requestId,
                },
            });
        }
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Authentication error",
            meta: {
                timestamp: new Date().toISOString(),
                endpoint: req.originalUrl,
                requestId,
            },
        });
    }
};
exports.authenticate = authenticate;
/**
 * Authorization Middleware
 * ตรวจสอบ user level/permission
 */
const authorize = (allowedLevels) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    statusCode: 401,
                    success: false,
                    message: "User not authenticated",
                    meta: {
                        timestamp: new Date().toISOString(),
                        endpoint: req.originalUrl,
                        requestId: req.requestId,
                    },
                });
            }
            // If no level is set, assume 'user' level
            const userLevel = req.user.level || "User";
            // Case-insensitive comparison
            const normalizedUserLevel = userLevel.toLowerCase();
            const normalizedAllowedLevels = allowedLevels.map(level => level.toLowerCase());
            if (!normalizedAllowedLevels.includes(normalizedUserLevel)) {
                return res.status(403).json({
                    statusCode: 403,
                    success: false,
                    message: "You do not have permission to access this resource",
                    meta: {
                        timestamp: new Date().toISOString(),
                        endpoint: req.originalUrl,
                        requestId: req.requestId,
                    },
                });
            }
            next();
        }
        catch (error) {
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: "Authorization error",
                meta: {
                    timestamp: new Date().toISOString(),
                    endpoint: req.originalUrl,
                    requestId: req.requestId,
                },
            });
        }
    };
};
exports.authorize = authorize;
