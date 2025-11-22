"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignIn from "./signin/page";
import { checkAuth, getDefaultRedirectPath } from "./utils/authHelper";

export default function Home() {
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
    <div>
      <SignIn />
    </div>
  );
}
