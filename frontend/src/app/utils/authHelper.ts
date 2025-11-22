import { getAccessToken } from "../services/tokenService";
import { userInfo } from "../services/userService";

/**
 * ตรวจสอบว่า user login อยู่และ token ยังใช้ได้หรือไม่
 * @returns { isAuthenticated: boolean, userLevel: string | null }
 */
export const checkAuth = async (): Promise<{
  isAuthenticated: boolean;
  userLevel: string | null;
}> => {
  try {
    const token = getAccessToken();

    if (!token) {
      return { isAuthenticated: false, userLevel: null };
    }

    // ลองเรียก API เพื่อ verify token
    const response = await userInfo();

    if (response.success && response.data) {
      return {
        isAuthenticated: true,
        userLevel: response.data.level,
      };
    }

    return { isAuthenticated: false, userLevel: null };
  } catch (error) {
    // Token invalid หรือ expired
    return { isAuthenticated: false, userLevel: null };
  }
};

/**
 * ตรวจสอบว่ามี token หรือไม่ (ไม่ verify กับ backend)
 * ใช้สำหรับ quick check
 */
export const hasToken = (): boolean => {
  const token = getAccessToken();
  return !!token;
};

/**
 * ได้รับ default redirect path ตาม user level
 * @param userLevel - ระดับผู้ใช้ (admin, user, etc.)
 * @returns path สำหรับ redirect
 */
export const getDefaultRedirectPath = (userLevel: string | null): string => {
  // Admin ไปหน้า dashboard, User ไปหน้า sell
  if (userLevel === "Admin") {
    return "/admin/dashboard";
  }

  if(userLevel === "User"){
    return "/admin/sell";
  }
  return "/signin";
};
