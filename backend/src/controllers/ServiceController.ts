import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const listService = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  try {
    const response = await prisma.service.findMany({
      orderBy: {
        payDate: "desc",
      },
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "List service successfully!",
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

export const createService = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  const { name, price, remark } = req.body;

  try {
    const response = await prisma.service.create({
      data: {
        name: name,
        price: parseFloat(price.toFixed(2)),
        remark: remark,
        payDate: new Date(),
      },
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Create service successfully!",
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

export const updateService = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  const { id } = req.params;
  const { name, price, remark } = req.body;
  try {
    const response = await prisma.service.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        price: parseFloat(price.toFixed(2)),
        remark: remark,
      },
    });

    return res.status(201).json({
      statusCode: 200,
      success: true,
      message: "Update service successfully",
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

export const removeService = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  const { id } = req.params;
  try {
    const response = await prisma.service.delete({
      where: {id: id}
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Remove service successfully",
      data: response,
      meta:{
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      }
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
