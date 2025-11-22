"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignIn = validateSignIn;
exports.validateSignUp = validateSignUp;
exports.validateCreateCompany = validateCreateCompany;
function validateSignIn(username, password, requestId, endpoint) {
    if (!username || !password) {
        return {
            statusCode: 400,
            success: false,
            message: "กรุณาระบุข้อมูลให้ครบ",
            meta: {
                timestamp: new Date().toISOString(),
                endpoint: endpoint,
                requestId: requestId,
            },
        };
    }
    return null;
}
function validateSignUp(firstName, lastName, username, password, confirmPassword, requestId, endpoint) {
    if (!firstName || !lastName || !username || !password || !confirmPassword) {
        return {
            statusCode: 400,
            success: false,
            message: "กรุณาระบุข้อมูลให้ครบถ้วน",
            meta: {
                timestamp: new Date().toISOString(),
                endpoint: endpoint,
                requestId: requestId,
            }
        };
    }
    if (confirmPassword != password) {
        return {
            success: false,
            message: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน",
        };
    }
    return null;
}
function validateCreateCompany(name, address, phone, email, taxCode, requestId, endpoint) {
    if (!name || !address || !phone || !email || !taxCode) {
        return {
            statusCode: 400,
            success: false,
            message: "กรุณาระบุข้อมูลให้ครบถ้วน",
            meta: {
                timestamp: new Date().toISOString(),
                endpoint: endpoint,
                requestId: requestId,
            }
        };
    }
}
