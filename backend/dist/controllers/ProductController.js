"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToExcel = exports.removeProduct = exports.updateProduct = exports.createProduct = exports.listProduct = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const exceljs_1 = __importDefault(require("exceljs"));
const listProduct = async (req, res) => {
    const requestId = (0, uuid_1.v4)();
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalRow = await prisma.product.count({
            where: {
                status: {
                    not: "delete",
                },
            },
        });
        const totalPages = Math.ceil(totalRow / limit);
        const response = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                status: {
                    not: "delete",
                },
            },
            skip: skip,
            take: limit,
        });
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "แสดงข้อมูลรายการสินค้า สำเร็จ",
            data: response,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalRow,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            meta: {
                timestamp: new Date().toISOString(),
                endpoint: req.originalUrl,
                requestId,
            },
        });
    }
    catch (error) {
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
exports.listProduct = listProduct;
const createProduct = async (req, res) => {
    const requestId = (0, uuid_1.v4)();
    const { serial, name, release, color, price, customerName, customerPhone, customerAddress, remark, qty, } = req.body;
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
            }
            else {
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
    }
    catch (error) {
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
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    const requestId = (0, uuid_1.v4)();
    const { serial, name, release, color, price, customerName, customerPhone, customerAddress, remark, } = req.body;
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
    }
    catch (error) {
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
exports.updateProduct = updateProduct;
const removeProduct = async (req, res) => {
    const requestId = (0, uuid_1.v4)();
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
    }
    catch (error) {
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
exports.removeProduct = removeProduct;
const exportToExcel = async (req, res) => {
    const requestId = (0, uuid_1.v4)();
    try {
        const page = Number(req.query.page) || 0;
        const limit = 10;
        const skip = page > 0 ? (page - 1) * limit : 0;
        const response = await prisma.product.findMany({
            where: {
                status: {
                    not: "delete",
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: page > 0 ? skip : undefined,
            take: page > 0 ? limit : undefined,
        });
        const fileName = `Products_${page > 0 ? `Page${page}_` : "All_"}${new Date().getTime()}.xlsx`;
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet("Products");
        // Create Header Table
        worksheet.columns = [
            { header: "Serial", key: "serial", width: 15 },
            { header: "ชื่อสินค้า", key: "name", width: 30 },
            { header: "รุ่น", key: "release", width: 20 },
            { header: "สี", key: "color", width: 15 },
            { header: "ราคา", key: "price", width: 15 },
            { header: "ชื่อลูกค้า", key: "customerName", width: 25 },
            { header: "เบอร์โทรศัพท์", key: "customerPhone", width: 15 },
            { header: "ที่อยู่", key: "customerAddress", width: 40 },
            { header: "หมายเหตุ", key: "remark", width: 30 },
            { header: "วันที่สร้าง", key: "createdAt", width: 20 },
        ];
        //  Added Data to Excel
        response.forEach((item) => {
            worksheet.addRow({
                serial: item.serial || "-",
                name: item.name,
                release: item.release,
                color: item.color,
                price: item.price,
                customerName: item.customerName,
                customerPhone: item.customerPhone,
                customerAddress: item.customerAddress,
                remark: item.remark || "-",
                createdAt: new Date(item.createdAt).toLocaleString("th-TH"),
            });
        });
        // Set response headers for file download
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    }
    catch (error) {
        console.error("Export Excel Error:", error);
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
exports.exportToExcel = exportToExcel;
