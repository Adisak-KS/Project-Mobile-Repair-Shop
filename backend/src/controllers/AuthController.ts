import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { validateSignIn, validateSignUp } from "../utils/validation";

dotenv.config();
const prisma = new PrismaClient();

export const signIn = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  const { username, password } = req.body;

  // Validate Input Data
  const errorValidate = validateSignIn(
    username,
    password,
    requestId,
    req.originalUrl
  );

  if (errorValidate) {
    return res.status(400).json(errorValidate);
  }

  try {
    // Find user by username for SignIn
    const user = await prisma.user.findFirst({
      where: {
        username: username,
        status: "active",
      },
    });

    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "User not found",
        meta: {
          timestamp: new Date().toISOString(),
          endpoint: req.originalUrl,
          requestId: requestId,
        },
      });
    }

    // Check Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "Invalid username or password",
        meta: {
          timestamp: new Date().toISOString(),
          endpoint: req.originalUrl,
          requestId: requestId,
        },
      });
    }

    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined in environment variables");
    }
    const token = jwt.sign(
      { id: user.id, level: user.level },
      process.env.SECRET_KEY,
      { expiresIn: "3d" } // หมดอายุใน 3 วัน (72 ชั่วโมง)
    );
    return res.json({
      statusCode: 200,
      success: true,
      message: "SignIn Successfully",
      data: {
        user: {
          userId: user.id,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          username: user.username,
          level: user.level,
          status: user.status,
        },
        token,
      },
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId: requestId,
      },
    });
  } catch (error: any) {
    console.error(`[${requestId}] signIn error:`, error);
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      },
    });
  }
};

export const signUp = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  const { firstName, lastName, username, password, confirmPassword } = req.body;

  //  Validate Input Data
  const errorValidate = validateSignUp(
    firstName,
    lastName,
    username,
    password,
    confirmPassword,
    requestId,
    req.originalUrl
  );

  if (errorValidate) {
    return res.status(400).json(errorValidate);
  }

  try {
    //  Check if username already exists
    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({
        statusCode: 409,
        success: false,
        message: "ไม่สามารถใช้ Username นี้ได้",
        meta: {
          timestamp: new Date().toISOString(),
          endpoint: req.originalUrl,
          requestId,
        },
      });
    }

    // Encrypt Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create New User
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      statusCode: 201,
      success: true,
      message: "สมัครสมาชิกสำเร็จ",
      data: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      },
    });
  } catch (error: any) {
    console.error("signUp error : ", error);
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
