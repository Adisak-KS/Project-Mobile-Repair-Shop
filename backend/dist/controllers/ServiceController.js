"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeService = exports.updateService = exports.createService = exports.listService = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const listService = async (req, res) => {
    const requestId = (0, uuid_1.v4)();
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
    }
    catch (error) {
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
exports.listService = listService;
const createService = async (req, res) => {
    const requestId = (0, uuid_1.v4)();
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
    }
    catch (error) {
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
exports.createService = createService;
const updateService = async (req, res) => {
    const requestId = (0, uuid_1.v4)();
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
    }
    catch (error) {
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
exports.updateService = updateService;
const removeService = async (req, res) => {
    const requestId = (0, uuid_1.v4)();
    const { id } = req.params;
    try {
        const response = await prisma.service.delete({
            where: { id: id }
        });
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Remove service successfully",
            data: response,
            meta: {
                timestamp: new Date().toISOString(),
                endpoint: req.originalUrl,
                requestId,
            }
        });
    }
    catch (error) {
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
exports.removeService = removeService;
