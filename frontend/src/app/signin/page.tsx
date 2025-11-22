"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "../services/authService";
import SignInForm from "../components/forms/SignInForm";
import { validateSignIn } from "../utils/validation";
import { extractErrorMessage, translateMessage } from "../utils/errorHandler";
import { setAccessToken } from "../services/tokenService";
import { checkAuth, getDefaultRedirectPath } from "../utils/authHelper";
import toast from "react-hot-toast";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkExistingAuth = async () => {
      const { isAuthenticated, userLevel } = await checkAuth();

      if (isAuthenticated) {
        // มี token ที่ยังใช้ได้อยู่ redirect ไปหน้าที่เหมาะสม (ใช้ replace)
        const redirectPath = getDefaultRedirectPath(userLevel);
        router.replace(redirectPath);
      } else {
        setIsChecking(false);
      }
    };

    checkExistingAuth();
  }, [router]);

  const handleSignIn = async () => {
    const errorValidateMessage = validateSignIn(username, password);
    if (errorValidateMessage) {
      toast.error(errorValidateMessage);
      return;
    }

    try {
      setIsLoading(true);

      const response = await SignIn(username, password);
      if (response.success) {
        // เก็บ token โดยใช้ tokenService
        setAccessToken(response.data.token);
        const redirectPath = getDefaultRedirectPath(response.data.user.level);
        router.replace(redirectPath);
      } else {
        toast.error(translateMessage(response.message) || "เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // แสดง loading ขณะกำลังตรวจสอบ token
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">กำลังตรวจสอบ...</p>
        </div>
      </div>
    );
  }

  return (
    <SignInForm
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
      handleSignIn={handleSignIn}
      isLoading={isLoading}
    />
  );
}
