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
      where: { serial: serial,
        status: 'instock'
       },
    });

    if (!product) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Serial not found in stock",
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

export const listSell = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  try {
    const response = await prisma.sell.findMany({
      where: {
        status: "Pending",
      },
      orderBy: {
        id: "desc",
      },

      select: {
        product: {
          select: {
            serial: true,
            name: true,
          },
        },
        id: true,
        price: true,
      },
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Show list sell products successfully!",
      data: response,
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      statuscode: 500,
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

export const removeSell = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  const { id } = req.params;
  try {
    const product = await prisma.sell.findFirst({
      where: {
        id: id,
      },
    });

    if (!product) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Product sell not found",
        meta: {
          timestamp: new Date().toISOString(),
          endpoint: req.originalUrl,
          requestId,
        },
      });
    }

    const response = await prisma.sell.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Delete product successfully!",
      data: product,
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

export const confirmSell = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  try {
    const sells = await prisma.sell.findMany({
      where: {
        status: "pending",
      },
    });

    for (const sell of sells) {
      await prisma.product.update({
        data: {
          status: "Sold",
        },
        where: {
          id: sell.productId,
        },
      });
    }

    const response = await prisma.sell.updateMany({
      where: {
        status: "Pending",
      },
      data: {
        status: "Paid",
        payDate: new Date(),
      },
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Confirm product successfully!",
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
