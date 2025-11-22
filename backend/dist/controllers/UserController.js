"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserInfo = exports.infoUser = exports.removeUser = exports.updateUser = exports.createUser = exports.listUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const listUser = async (req, res) => {
    const requestId = req.requestId || (0, uuid_1.v4)();
    try {
        const response = await prisma.user.findMany({
            where: {
                status: "active",
            },
            orderBy: {
                id: "desc",
            },
        });
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "List user successfully!",
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
exports.listUser = listUser;
const createUser = async (req, res) => {
    const requestId = req.requestId || (0, uuid_1.v4)();
    const { firstName, lastName, username, password, level } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        });
        if (user) {
            return res.status(409).json({
                statusCode: 409,
                success: false,
                message: "ไม่สามารถใช้ Username นี้ได้",
                meta: {
                    timestamp: new Date().toISOString(),
                    endpoint: req.originalUrl,
                    requestId,
                },
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const response = await prisma.user.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: hashedPassword,
                level: level,
            },
        });
        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Create user successfully!",
            data: {
                userId: response.id,
                firstName: response.firstName,
                lastName: response.lastName,
                username: response.username,
                level: response.level,
                createdAt: response.createdAt,
                updatedAt: response.updatedAt,
            },
            meta: {
                timestamp: new Date().toISOString(),
                endpoint: req.originalUrl,
                requestId,
            },
        });
    }
    catch (error) {
        res.status(500).json({
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
exports.createUser = createUser;
const updateUser = async (req, res) => {
    const requestId = req.requestId || (0, uuid_1.v4)();
    const { id } = req.params;
    const { firstName, lastName, username, password, level } = req.body;
    try {
        const oldUser = await prisma.user.findFirst({
            where: {
                id: id,
            },
        });
        if (!oldUser) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "ไม่พบ id ของผู้ใช้นี้",
                meta: {
                    timestamp: new Date().toISOString(),
                    endpoint: req.originalUrl,
                    requestId,
                },
            });
        }
        let newPassword = oldUser.password;
        if (password && password.trim() !== "") {
            newPassword = await bcrypt_1.default.hash(password, 10);
        }
        const response = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: newPassword,
                level: level,
            },
        });
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Update user successfully",
            data: {
                userId: response.id,
                firstName: response.firstName,
                lastName: response.lastName,
                username: response.username,
                level: response.level,
                createdAt: response.createdAt,
                updatedAt: response.updatedAt,
            },
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
exports.updateUser = updateUser;
const removeUser = async (req, res) => {
    const requestId = req.requestId || (0, uuid_1.v4)();
    const { id } = req.params;
    try {
        const response = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                status: "inActive",
            },
        });
        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Remove User Successfully!",
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
exports.removeUser = removeUser;
const infoUser = async (req, res) => {
    const requestId = req.requestId || (0, uuid_1.v4)();
    try {
        if (!req.user) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "User not authenticated",
                meta: {
                    timestamp: new Date().toISOString(),
                    endpoint: req.originalUrl,
                    requestId,
                },
            });
        }
        const user = await prisma.user.findFirst({
            where: { id: req.user.id },
            select: {
                firstName: true,
                lastName: true,
                username: true,
                level: true,
            },
        });
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "User info retrieved successfully",
            data: user,
            meta: {
                timestamp: new Date().toISOString(),
                endpoint: req.originalUrl,
                requestId,
            },
        });
    }
    catch (error) {
        res.status(500).json({
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
exports.infoUser = infoUser;
const updateUserInfo = async (req, res) => {
    const requestId = req.requestId || (0, uuid_1.v4)();
    const { firstName, lastName, username, password } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: "User not authenticated",
                meta: {
                    timestamp: new Date().toISOString(),
                    endpoint: req.originalUrl,
                    requestId,
                },
            });
        }
        const oldUser = await prisma.user.findFirst({
            where: { id: req.user.id },
        });
        if (!oldUser) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "User not found",
                meta: {
                    timestamp: new Date().toISOString(),
                    endpoint: req.originalUrl,
                    requestId,
                },
            });
        }
        const newPassword = password
            ? await bcrypt_1.default.hash(password, 10)
            : oldUser.password;
        const response = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: newPassword,
            },
        });
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Update User Successfully!",
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
exports.updateUserInfo = updateUserInfo;
