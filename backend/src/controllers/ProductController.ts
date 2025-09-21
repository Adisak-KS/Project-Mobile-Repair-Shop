import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

export const listProduct = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  try {
    const response = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        status: {
          not: "delete",
        },
      },
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "แสดงข้อมูลรายการสินค้า สำเร็จ",
      data: response,
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      },
    });
  } catch (error: any) {
    console.error("List Product Error", error);
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

export const createProduct = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  const {
    serial,
    name,
    release,
    color,
    price,
    customerName,
    customerPhone,
    customerAddress,
    remark,
  } = req.body;

  const payload = {
    serial: serial,
    name: name,
    release: release,
    color: color,
    price: Number(price),
    customerName: customerName,
    customerPhone: customerPhone,
    customerAddress: customerAddress,
    remark: remark ?? "",
  };

  try {
    const existingProduct = await prisma.product.findFirst({
      where: { serial: payload.serial },
    });

    if (existingProduct) {
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Serial นี้ถูกขายออกไปก่อนหน้านี้แล้ว",
        meta: {
          timestamp: new Date().toISOString(),
          endpoint: req.originalUrl,
          requestId,
        },
      });
    }

    const response = await prisma.product.create({
      data: payload,
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Create Product Successfully!",
      data: response,
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      },
    });
  } catch (error: any) {
    console.error("Create Product Error", error);
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

export const updateProduct = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  const {
    serial,
    name,
    release,
    color,
    price,
    customerName,
    customerPhone,
    customerAddress,
    remark,
  } = req.body;

  const payload = {
    serial: serial,
    name: name,
    release: release,
    color: color,
    price: Number(price),
    customerName: customerName,
    customerPhone: customerPhone,
    customerAddress: customerAddress,
    remark: remark ?? "",
  };

  try {
    // Check Serial
    const existingSerial = await prisma.product.findFirst({
      where: {
        serial: serial,
        NOT: { id: req.params.id },
      },
    });

    if (existingSerial) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "หมายเลข Serial ซ้ำ",
        meta: {
          timestamp: new Date().toISOString(),
          endpoint: req.originalUrl,
          requestId,
        },
      });
    }

    // Update product
    const response = await prisma.product.update({
      data: payload,
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Update Product Successfully!",
      data: response,
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      },
    });
  } catch (error: any) {
    console.error("Update Product Error", error);
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

export const removeProduct = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "ไม่พบข้อมูลสินค้าที่ต้องการลบ",
        meta: {
          timestamp: new Date().toISOString(),
          endpoint: req.originalUrl,
          requestId,
        },
      });
    }

    const response = await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: `ลบข้อมูลสินค้า ${response.name} สำเร็จ`,
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      },
    });
  } catch (error: any) {
    console.error("Remove Product Error :", error);
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
