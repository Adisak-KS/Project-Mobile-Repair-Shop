import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const infoUser = async (req: Request, res: Response) => {
  const requestId = uuidv4();
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

    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined in environment variables");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload & {
      id: string;
    };
    const user = await prisma.user.findFirst({
      where: { id: decoded.id },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        level: true,
      },
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "User info retrieved successfully",
      data: user,
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: error.message,
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      },
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const requestId = uuidv4();

  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }

  const { firstName, lastName, username, password } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload & {
      id: string;
    };

    const oldUser = await prisma.user.findFirst({
      where: { id: decoded.id },
    });

    if (!oldUser) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "User not found",
        meta: {
          timestamp: new Date().toISOString(),
          endpoint: req.originalUrl,
          requestId,
        },
      });
    }

    const newPassword = password
      ? await bcrypt.hash(password, 10)
      : oldUser.password;

    const response = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        firstName: firstName,
        lastName: lastName,
        password: newPassword,
      },
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Update User Successfully!",
      data: response,
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: error.message,
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      },
    });
  }
};
