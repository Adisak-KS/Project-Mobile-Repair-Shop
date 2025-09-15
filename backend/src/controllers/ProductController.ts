import { prisma } from "../configs/prismaClient";
import { Request, Response } from "express";

export const listProduct = async (req: Request, res: Response) => {
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
      success: true,
      message: "แสดงข้อมูลรายการสินค้า สำเร็จ",
      data: response,
    });
  } catch (error: any) {
    console.error("List Product Error", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
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
    const check = await prisma.product.findFirst({
      where: { serial: payload.serial },
    });

    if (check) {
      return res.status(500).json({
        success: false,
        message: "Serial นี้ถูกขายออกไปก่อนหน้านี้แล้ว",
      });
    }

    const response = await prisma.product.create({
      data: payload,
    });

    return res.status(200).json({
      success: true,
      message: "เพิ่มข้อมูลสำเร็จ",
      data: response,
    });
  } catch (error: any) {
    console.error("Create Product Error", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
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
        success: false,
        message: "หมายเลข Serial ซ้ำ",
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
      success: true,
      message: "แก้ไขข้อมูลสำเร็จ",
      data: response,
    });
  } catch (error: any) {
    console.error("Update Product Error", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeProduct = async (req: Request, res: Response) => {
  try {
    const check = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!check) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบข้อมูลสินค้าที่ต้องการลบ",
      });
    }

    const response = await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: `ลบข้อมูลสินค้า ${response.name} สำเร็จ`,
    });
  } catch (error: any) {
    console.error("Remove Product Error :", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
