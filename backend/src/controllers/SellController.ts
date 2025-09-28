import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

export const createSell = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  const { serial, price } = req.body;

  if (!serial || !price || isNaN(Number(price))) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Serial and Price are required",
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      },
    });
  }

  try {
    const product = await prisma.product.findFirst({
      where: { serial: serial },
    });

    if (!product) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Serial not found",
        meta: {
          timestamp: new Date().toISOString(),
          endpoint: req.originalUrl,
          requestId,
        },
      });
    }

    const response = await prisma.sell.create({
      data: {
        productId: product.id,
        price: price,
        payDate: new Date(),
      },
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Create Sell Successfully!",
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
