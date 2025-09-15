export function validateSignIn(username: string, password: string) {
  if (!username || !password) {
    return {
      success: false,
      message: "กรุณาระบุข้อมูลให้ครบ",
    };
  }

  return null;
}

export function validateSignUp(
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  confirmPassword: string
) {
  if (!firstName || !lastName || !username || !password || !confirmPassword) {
    return {
      success: false,
      message: "กรุณาระบุข้อมูลให้ครบถ้วน",
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
  taxCode: string
) {
  if (!name || !address || !phone || !email || !taxCode) {
    return {
      success: false,
      message: "กรุณาระบุข้อมูลให้ครบถ้วน",
    };
  }
}
