"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCompany = exports.createCompany = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const validation_1 = require("../utils/validation");
const prisma = new client_1.PrismaClient();
const createCompany = async (req, res) => {
    const requestId = (0, uuid_1.v4)();
    const { name, address, phone, email = "", taxCode } = req.body;
    const payload = {
        name: name,
        address: address,
        phone: phone,
        email: email,
        taxCode: taxCode,
    };
    // Validate Data
    const errorValidate = (0, validation_1.validateCreateCompany)(name, address, phone, email, taxCode, requestId, req.originalUrl);
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
        }
        else {
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
    }
    catch (error) {
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
exports.createCompany = createCompany;
const listCompany = async (req, res) => {
    const requestId = (0, uuid_1.v4)();
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
    }
    catch (error) {
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
exports.listCompany = listCompany;
