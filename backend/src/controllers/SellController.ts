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
      where: { serial: serial, status: "instock" },
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

export const dashboardSell = async (req: Request, res: Response) => {
  const requestId = uuidv4();

  try {
    const year = req.params.year ? Number(req.params.year) : new Date().getFullYear();
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year + 1}-01-01`);

    // รวมยอดขายทั้งหมด
    const totalIncomeAgg = await prisma.sell.aggregate({
      _sum: { price: true },
      where: {
        status: "Paid",
        payDate: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    // จำนวนงานซ่อมทั้งหมด
    const totalRepair = await prisma.service.count();

    // จำนวนรายการขายที่จ่ายแล้ว
    const totalSale = await prisma.sell.count({
      where: { status: "Paid" },
    });

    // ข้อมูลขายทั้งหมด (price + createdAt)
    const sells = await prisma.sell.findMany({
      where: {
        status: "Paid",
        payDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: { price: true, payDate: true },
    });

    // ชื่อเดือนภาษาไทย
    const monthsTH = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    // สร้าง array 12 เดือน เริ่มต้น 0
    const incomePerMonth = monthsTH.map((m) => ({ month: m, income: 0 }));

    // รวมยอดขายต่อเดือน
    sells.forEach((s) => {
      if (s.payDate) {
        const monthIndex = new Date(s.payDate).getMonth(); // 0-11
        incomePerMonth[monthIndex].income += Number(s.price);
      }
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Dashboard sell successfully!",
      data: {
        totalIncome: totalIncomeAgg._sum.price ?? 0,
        totalRepair,
        totalSale,
        incomePerMonth,
      },
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

export const historySell = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  try {
    const response = await prisma.sell.findMany({
      where: {
        status: "Paid",
      },
      orderBy: {
        id: "desc",
      },
      include: {
        product: {
          select: {
            serial: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "History sell successfully!",
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

export const infoSell = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  try {
    const { id } = req.params;

    const response = await prisma.sell.findUnique({
      where: {
        id: id,
        status: "Paid",
      },
      include: {
        product: true,
      },
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Info Sell Successfully!",
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
