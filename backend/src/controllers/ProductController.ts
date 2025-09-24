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
    qty,
  } = req.body;

  const payload = {
    serial: serial || null,
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
    if (qty > 1000) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Qty must be less than 1000",
        meta: {
          timestamp: new Date().toISOString(),
          endpoint: req.originalUrl,
          requestId,
        },
      });
    }

    let responses = [];
    for (let i = 0; i < qty; i++) {
      const data = { ...payload };

      if (i === 0) {
        // ตัวแรกเก็บ serial ที่ user กรอก
        data.serial = serial || null;
      } else {
        // ตัวที่เหลือ serial ว่าง
        data.serial = null;
      }

      const response = await prisma.product.create({ data });
      responses.push(response);
    }

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Create Product Successfully!",
      data: responses,
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

  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Product not found",
        meta: {
          timestamp: new Date().toISOString(),
          endpoint: req.originalUrl,
          requestId,
        },
      });
    }

    // Update product
    const response = await prisma.product.update({
      data: {
        serial: serial ?? "",
        name: name,
        release: release,
        color: color,
        price: Number(price),
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        remark: remark ?? "",
      },
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
      message: `Delete ${response.name} Successfully`,
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
