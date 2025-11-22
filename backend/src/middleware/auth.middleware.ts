import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

// Extend Express Request type to include user data
export interface AuthRequest extends Request {
  user?: {
    id: string;
    level?: string;
  };
  requestId?: string;
}

/**
 * Authentication Middleware
 * ตรวจสอบ JWT token จาก Authorization header
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const requestId = uuidv4();
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
    const decoded = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload & {
      id: string;
      level?: string;
    };

    // Attach user info to request
    req.user = {
      id: decoded.id,
      level: decoded.level,
    };

    next();
  } catch (error: any) {
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

/**
 * Authorization Middleware
 * ตรวจสอบ user level/permission
 */
export const authorize = (allowedLevels: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
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
    } catch (error: any) {
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
