import { validateCreateCompany } from "../utils/validation";
import { prisma } from "../configs/prismaClient";
import { Request, Response } from "express";

export const createCompany = async (req: Request, res: Response) => {
  const { name, address, phone, email = "", taxCode } = req.body;
  const payload = {
    name: name,
    address: address,
    phone: phone,
    email: email,
    taxCode: taxCode,
  };

  const errorValidate = validateCreateCompany(
    name,
    address,
    phone,
    email,
    taxCode
  );

  if (errorValidate) {
    return res.status(400).json(errorValidate);
  }

  try {
    const existingCompany = await prisma.company.findFirst();
    let company;
    if (existingCompany) {
      company = await prisma.company.update({
        where: { id: existingCompany.id },
        data: payload,
      });
    } else {
      company = await prisma.company.create({
        data: payload,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${existingCompany ? "Update" : "Create"} Company Successfully`,
      data: company,
    });
  } catch (error: any) {
    console.error("CreateCompany error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const listCompany = async (req: Request, res: Response) => {
  try {
    const company = await prisma.company.findFirst();
    return res.status(200).json({
      success: true,
      message: "Company List Successfully",
      data: company,
    });
  } catch (error: any) {
    console.error("Error Company List :", error);
    return res.status(500).json(error.message);
  }
};
