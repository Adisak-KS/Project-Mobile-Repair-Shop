"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "../components/ui/modal";
import { updateUser, updateUserInfo, userInfo } from "../services/userService";
import { removeAccessToken } from "../services/tokenService";
import toast from "react-hot-toast";
import { extractErrorMessage, translateMessage } from "../utils/errorHandler";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [level, setLevel] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await userInfo();
      setFirstName(response.data.firstName);
      setLastName(response.data.lastName);
      setUsername(response.data.username);
      setLevel(response.data.level);
    } catch (error) {
      // Token invalid หรือ missing จะถูกจัดการโดย axios interceptor
      // interceptor จะ redirect ไป /signin อัตโนมัติ
      console.error("Failed to fetch user info:", error);
    }
  };

  const handleSignOut = () => {
    setShowSignOutConfirm(true);
  };

  const confirmSignOut = () => {
    // ลบ token ออกจาก localStorage
    removeAccessToken();
    setShowSignOutConfirm(false);

    // Redirect ไปหน้า signin
    router.replace("/signin");
  };

  const cancelSignOut = () => {
    setShowSignOutConfirm(false);
  };

  const handleShowModal = () => {
    setIsShow(true);
  };

  const handleCloseModal = () => {
    setIsShow(false);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (password !== confirmPassword) {
        toast.error("รหัสผ่าน ไม่ตรงกัน");
        return;
      }

      const response = await updateUserInfo(
        firstName,
        lastName,
        password,
        level
      );
      if (response.success) {
        fetchData();
        toast.success(translateMessage(response.message));
        handleCloseModal();
      } else {
        toast.error(translateMessage(response.message));
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    ...(level === "Admin"
      ? [
          {
            href: "/admin/dashboard",
            icon: "fa-solid fa-gauge",
            label: "Dashboard",
            admin: true,
          },
          {
            href: "/admin/buy",
            icon: "fa-solid fa-basket-shopping",
            label: "ซื้อสินค้า",
            admin: true,
          },
        ]
      : []),
    {
      href: "/admin/sell",
      icon: "fa-solid fa-dollar-sign",
      label: "ขายสินค้า",
      admin: false,
    },
    {
      href: "/admin/repair",
      icon: "fa-solid fa-screwdriver-wrench",
      label: "รายการซ่อม",
      admin: false,
    },
    ...(level === "Admin"
      ? [
          {
            href: "/admin/company",
            icon: "fa-solid fa-building",
            label: "ข้อมูลร้าน",
            admin: true,
          },
          {
            href: "/admin/user",
            icon: "fa-solid fa-user-group",
            label: "ผู้ใช้งาน",
            admin: true,
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle Menu"
      >
        <i
          className={`fa ${isMobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}
        ></i>
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-linear-to-b from-slate-900 via-slate-800 to-slate-900
          h-screen shadow-2xl flex flex-col
          fixed lg:static top-0 left-0 z-40
          w-64 lg:w-64
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Header Section */}
        <div className="p-6 bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <i className="fa fa-mobile-alt text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold">Mobile Repair</h1>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-4 relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 w-full text-left hover:bg-white/10 rounded-lg p-2 transition-all"
            >
              <div className="bg-white/20 rounded-full p-2 flex items-center justify-center w-10 h-10">
                <i className="fa fa-user text-lg"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {firstName} {lastName}
                </p>
                <p className="text-xs text-blue-200">{level}</p>
              </div>
              <i
                className={`fa fa-chevron-down transition-transform duration-200 ${
                  isProfileDropdownOpen ? "rotate-180" : ""
                }`}
              ></i>
            </button>

            {isProfileDropdownOpen && (
              <div className="flex gap-2 mt-3 animate-fade-in">
                <button
                  onClick={() => {
                    handleShowModal();
                    setIsProfileDropdownOpen(false);
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-3 py-2 transition-all duration-200 hover:scale-105 shadow-md"
                  title="แก้ไขข้อมูล"
                >
                  <i className="fa fa-pencil mr-1"></i>
                  <span className="text-sm">แก้ไข</span>
                </button>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsProfileDropdownOpen(false);
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 transition-all duration-200 hover:scale-105 shadow-md"
                  title="ออกจากระบบ"
                >
                  <i className="fa fa-sign-out-alt mr-1"></i>
                  <span className="text-sm">ออก</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Menu Section */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                          : "text-gray-300 hover:bg-slate-700/50 hover:text-white hover:translate-x-1"
                      }
                    `}
                  >
                    <i
                      className={`${item.icon} w-5 text-center ${
                        isActive ? "scale-110" : "group-hover:scale-110"
                      } transition-transform duration-200`}
                    ></i>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="text-center text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Mobile Repair</p>
          </div>
        </div>
      </div>

      <Modal
        title="แก้ไขข้อมูลผู้ใช้งาน"
        isOpen={isShow}
        onClose={handleCloseModal}
      >
        <div className="space-y-4">
          {/* Profile Icon */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
              <div className="relative bg-linear-to-br from-blue-500 to-indigo-600 rounded-full p-4 shadow-xl">
                <i className="fa fa-user-edit text-white text-3xl"></i>
              </div>
            </div>
          </div>

          {/* User Info Display */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-2">
                <i className="fa fa-id-badge text-blue-600 text-xl"></i>
              </div>
              <div>
                <p className="text-xs text-gray-600">ระดับผู้ใช้</p>
                <p className="font-bold text-blue-700">{level}</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            {/* First Name & Last Name - Side by Side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  ชื่อ
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  placeholder="ชื่อ"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  นามสกุล
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  placeholder="นามสกุล"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <i className="fa fa-user mr-2 text-blue-600"></i>
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                placeholder="ชื่อผู้ใช้"
              />
            </div>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500 font-semibold uppercase tracking-wide">
                  เปลี่ยนรหัสผ่าน (ถ้าต้องการ)
                </span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <i className="fa fa-lock mr-2 text-amber-600"></i>
                รหัสผ่านใหม่
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm"
                  placeholder="ใส่รหัสผ่านใหม่"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <i
                    className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <i className="fa fa-lock mr-2 text-amber-600"></i>
                ยืนยันรหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm"
                  placeholder="ยืนยันรหัสผ่านใหม่"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <i
                    className={`fa ${
                      showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3 border-t-2 border-gray-200">
            <button
              onClick={handleCloseModal}
              className="flex-1 bg-linear-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 border border-gray-300"
              disabled={isLoading}
            >
              <i className="fa fa-times mr-2"></i>
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <i className="fa fa-save mr-2"></i>
              {isLoading ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Sign Out Confirmation Modal */}
      <Modal
        title="ยืนยันการออกจากระบบ"
        isOpen={showSignOutConfirm}
        onClose={cancelSignOut}
        size="sm"
      >
        <div className="relative">
          {/* Animated Warning Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Pulse rings */}
              <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-0 bg-red-400 rounded-full animate-pulse opacity-50"></div>

              {/* Main icon */}
              <div className="relative bg-linear-to-br from-red-500 to-red-600 rounded-full p-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <i className="fa fa-exclamation-triangle text-white text-5xl drop-shadow-lg"></i>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              คุณต้องการออกจากระบบใช่หรือไม่?
            </h3>
            <p className="text-gray-600 text-base">
              คุณจะต้องเข้าสู่ระบบอีกครั้งเพื่อใช้งานต่อ
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={cancelSignOut}
              className="flex-1 bg-linear-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <i className="fa fa-times mr-2"></i>
              ยกเลิก
            </button>
            <button
              onClick={confirmSignOut}
              className="flex-1 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-red-500/50"
            >
              <i className="fa fa-sign-out-alt mr-2"></i>
              ออกจากระบบ
            </button>
          </div>

          {/* Bottom accent line */}
          <div className="mt-6 h-1 bg-linear-to-r from-red-400 via-red-500 to-red-400 rounded-full"></div>
        </div>
      </Modal>
    </>
  );
}
