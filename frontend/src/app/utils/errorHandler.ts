import { AxiosError } from "axios";

// Message translation map (English to Thai)
const messageTranslations: Record<string, string> = {
  // Authentication messages
  "User not found": "ไม่พบผู้ใช้งาน",
  "Invalid username or password": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
  "SignIn Successfully": "เข้าสู่ระบบสำเร็จ",
  "No token provided": "ไม่พบ token",
  "Invalid token format": "รูปแบบ token ไม่ถูกต้อง",
  "Invalid token": "Token ไม่ถูกต้อง",
  "Token expired": "Token หมดอายุ",
  "User not authenticated": "ผู้ใช้ยังไม่ได้เข้าสู่ระบบ",
  "You do not have permission to access this resource": "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้",
  "Authentication error": "เกิดข้อผิดพลาดในการยืนยันตัวตน",
  "Authorization error": "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์",

  // User messages
  "List user successfully!": "แสดงรายการผู้ใช้สำเร็จ",
  "Create user successfully!": "สร้างผู้ใช้สำเร็จ",
  "Update user successfully": "อัปเดตข้อมูลผู้ใช้สำเร็จ",
  "Update User Successfully!": "อัปเดตข้อมูลผู้ใช้สำเร็จ",
  "Remove User Successfully!": "ลบผู้ใช้สำเร็จ",
  "User info retrieved successfully": "ดึงข้อมูลผู้ใช้สำเร็จ",

  // Sell messages
  "Serial and Price are required": "กรุณาระบุ Serial และราคา",
  "Serial not found in stock": "ไม่พบ Serial นี้ในสต็อก",
  "Create Sell Successfully!": "สร้างรายการขายสำเร็จ",
  "Show list sell products successfully!": "แสดงรายการขายสำเร็จ",
  "Product sell not found": "ไม่พบรายการขาย",
  "Delete product successfully!": "ลบสินค้าสำเร็จ",
  "Confirm product successfully!": "ยืนยันรายการสำเร็จ",
  "Dashboard sell successfully!": "แสดง Dashboard สำเร็จ",
  "History sell successfully!": "แสดงประวัติการขายสำเร็จ",
  "Info Sell Successfully!": "แสดงข้อมูลการขายสำเร็จ",

  // Product messages
  "Qty must be less than 1000": "จำนวนต้องน้อยกว่า 1000",
  "List product successfully!": "แสดงรายการสินค้าสำเร็จ",
  "Create product successfully!": "สร้างสินค้าสำเร็จ",
  "Update product successfully": "อัปเดตข้อมูลสินค้าสำเร็จ",
  "Remove product successfully": "ลบสินค้าสำเร็จ",

  // Service messages
  "List service successfully!": "แสดงรายการบริการสำเร็จ",
  "Create service successfully!": "สร้างรายการบริการสำเร็จ",
  "Update service successfully": "อัปเดตรายการบริการสำเร็จ",
  "Remove service successfully": "ลบรายการบริการสำเร็จ",

  // Company messages
  "Update company successfully": "อัปเดตข้อมูลบริษัทสำเร็จ",
  "Create company successfully": "สร้างข้อมูลบริษัทสำเร็จ",
  "Company List Successfully": "แสดงข้อมูลบริษัทสำเร็จ",

  // Generic messages
  "Internal Server Error": "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
  "Unexpected error occurred": "เกิดข้อผิดพลาดที่ไม่คาดคิด",
};

/**
 * แปลข้อความจากภาษาอังกฤษเป็นภาษาไทย
 */
export function translateMessage(message: string): string {
  return messageTranslations[message] || message;
}

export function extractErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return translateMessage(error);
  }

  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || error.message;
    return translateMessage(message);
  }

  if (error instanceof Error) {
    return translateMessage(error.message);
  }
  return "เกิดข้อผิดพลาดที่ไม่คาดคิด";
}
