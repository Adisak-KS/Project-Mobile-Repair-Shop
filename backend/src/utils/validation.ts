import { timeStamp } from "console";

export function validateSignIn(
  username: string,
  password: string,
  requestId: string,
  endpoint: string
) {
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

export function validateSignUp(
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  confirmPassword: string,
  requestId: string,
  endpoint: string  
) {
  if (!firstName || !lastName || !username || !password || !confirmPassword) {
    return {
      statusCode: 400,
      success: false,
      message: "กรุณาระบุข้อมูลให้ครบถ้วน",
      meta:{
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

export function validateCreateCompany(
  name: string,
  address: string,
  phone: string,
  email: string,
  taxCode: string,
  requestId: string,
  endpoint: string

) {
  if (!name || !address || !phone || !email || !taxCode) {
    return {
      statusCode: 400,
      success: false,
      message: "กรุณาระบุข้อมูลให้ครบถ้วน",
      meta:{
        timestamp: new Date().toISOString(),
        endpoint: endpoint,
        requestId: requestId,
      }
    };
  }
}
