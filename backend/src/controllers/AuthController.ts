import { Request, Response } from "express";
import { prisma } from "../configs/prismaClient";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { validateSignIn, validateSignUp } from "../utils/validation";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is no defind in enviroment variables");
}

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const errorValidate = validateSignIn(username, password);
  if (errorValidate) {
    return res.status(400).json(errorValidate);
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
        status: "active",
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Username or Password",
      });
    }

    // สร้าง access token (อายุสั้น) และ refresh token (อายุนาน)
    const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: "7d",
    });

    // เก็บ refresh token แบบ hash
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await prisma.userRefreshToken.create({
      data: {
        userId: user.id,
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return res.json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    console.error("signIn error : ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const signUp = async (req: Request, res: Response) => {
  const { firstName, lastName, username, password, confirmPassword } = req.body;

  const errorValidate = validateSignUp(
    firstName,
    lastName,
    username,
    password,
    confirmPassword
  );

  if (errorValidate) {
    return res.status(400).json(errorValidate);
  }

  try {
    // ตรวจสอบ username ซ้ำ
    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "ไม่สามารถใช้ Username นี้ได้",
      });
    }

    // เข้ารหัส password
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
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
    });
  } catch (error: any) {
    console.error("signUp error : ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
