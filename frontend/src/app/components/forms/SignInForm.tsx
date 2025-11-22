"use client";

import Link from "next/link";
import { useState } from "react";

interface SignInFormProps {
  username: string;
  password: string;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  handleSignIn: () => void;
  isLoading: boolean;
}

export default function SignInForm({
  username,
  password,
  setUsername,
  setPassword,
  handleSignIn,
  isLoading,
}: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSignIn();
    }
  };

  return (
    <div className="min-h-screen sm:h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto sm:overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-48 sm:w-72 h-48 sm:h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-1/2 w-48 sm:w-72 h-48 sm:h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Sign In Card */}
      <div className="relative w-full max-w-md my-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-4 sm:p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative">
              {/* Icon */}
              <div className="flex justify-center mb-2 sm:mb-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                  <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-2.5 sm:p-3">
                    <i className="fa-solid fa-mobile-screen text-white text-2xl sm:text-3xl"></i>
                  </div>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Mobile Repair</h1>
              <p className="text-blue-100 text-xs">ระบบจัดการร้านซ่อมมือถือ</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="text-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">เข้าสู่ระบบ</h2>
              <p className="text-xs text-gray-600">กรุณากรอกข้อมูลเพื่อเข้าใช้งาน</p>
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-gray-700 mb-1.5">
                <i className="fa-solid fa-user text-blue-600 mr-1.5"></i>
                ชื่อผู้ใช้
              </label>
              <input
                id="username"
                type="text"
                maxLength={30}
                placeholder="กรอกชื่อผู้ใช้"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-gray-50 hover:bg-white"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1.5">
                <i className="fa-solid fa-lock text-blue-600 mr-1.5"></i>
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  maxLength={30}
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-gray-50 hover:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-arrow-right-to-bracket mr-2"></i>
                  เข้าสู่ระบบ
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-600">
                ยังไม่มีบัญชี?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                >
                  ลงทะเบียนที่นี่
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
