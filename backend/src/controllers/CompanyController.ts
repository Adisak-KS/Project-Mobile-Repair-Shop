import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { validateCreateCompany } from "../utils/validation";
const prisma = new PrismaClient();

export const createCompany = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  const { name, address, phone, email = "", taxCode } = req.body;
  const payload = {
    name: name,
    address: address,
    phone: phone,
    email: email,
    taxCode: taxCode,
  };

  // Validate Data
  const errorValidate = validateCreateCompany(
    name,
    address,
    phone,
    email,
    taxCode,
    requestId,
    req.originalUrl
  );

  if (errorValidate) {
    return res.status(400).json(errorValidate);
  }

  try {
    // Check if company already exists
    const existingCompany = await prisma.company.findFirst();
    let company;
    if (existingCompany) {
      // Have company data
      company = await prisma.company.update({
        where: { id: existingCompany.id },
        data: payload,
      });
    } else {
      // Do not have company data
      company = await prisma.company.create({
        data: payload,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: `${existingCompany ? "Update" : "Create"} company successfully`,
      data: company,
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      },
    });
  } catch (error: any) {
    console.error("Create Company error:", error);
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

export const listCompany = async (req: Request, res: Response) => {
  const requestId = uuidv4();
  try {
    const company = await prisma.company.findFirst();
    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Company List Successfully",
      data: company,
      meta: {
        timestamp: new Date().toISOString(),
        endpoint: req.originalUrl,
        requestId,
      },
    });
  } catch (error: any) {
    console.error("Error Company List :", error);
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
