export function validateSignIn(
  username: string,
  password: string
): string | null {
  if (!username.trim() || !password.trim()) {
    return "Please enter your username and password.";
  }

  if (username.trim().length < 8 || username.trim().length > 50) {
    return "Username ต้องมีความยาวระหว่าง 8 ถึง 50 ตัวอักษร";
  }

  if (password.trim().length < 8) {
    return "Password ต้องมีความยาวอย่างน้อย 8 ตัวอักษร";
  }

  return null;
}

export function validateSignUp(
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  confirmPassword: string
): string | null {
  if (!firstName || !lastName || !username || !password || !confirmPassword) {
    return "กรุณาระบุข้อมูลให้ครบถ้วน";
  }

  if (confirmPassword != password) {
    return "รหัสผ่านกับยีนยันรหัสผ่าน ไม่ตรงกัน";
  }

  return null;
}

export function validateCreateCompany(
  name: string,
  address: string,
  phone: string,
  email: string,
  taxCode: string
): string | null {
  if (!name || !address || !phone || !email || !taxCode) {
    return "กรุณาระบุข้อมูล ให้ครบถ้วน";
  }

  return null;
}

export function validateCreateBuy(
  serial: string,
  name: string,
  release: string,
  color: string,
  price: number,
  customerName: string,
  customerPhone: string,
  customerAddress: string
): string | null {
  if (
    !serial ||
    !name ||
    !release ||
    !color ||
    price == null ||
    !customerName ||
    !customerPhone ||
    !customerAddress
  ) {
    return "กรุณาระบุข้อมูล ให้ครบถ้วน";
  }
  return null;
}
