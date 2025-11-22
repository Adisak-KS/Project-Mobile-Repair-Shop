"use client";
import Modal from "@/app/components/ui/modal";
import {
  createUser,
  listUser,
  removeUser,
  updateUser,
} from "@/app/services/userService";
import { extractErrorMessage, translateMessage } from "@/app/utils/errorHandler";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  level: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [level, setLevel] = useState("User");
  const levelList = ["Admin", "User"];
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await listUser();
      setUsers(response.data);
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleSave = async () => {
    if (confirmPassword != password) {
      toast.error("รหัสผ่านไม่ถูกต้อง");
      return;
    }

    try {
      setIsLoading(true);
      if (!id) {
        const response = await createUser(
          firstName,
          lastName,
          username,
          password,
          confirmPassword,
          level
        );

        if (response.success) {
          toast.success(translateMessage(response.message));
          fetchData();
          handleCloseModal();
        } else {
          toast.error(translateMessage(response.message));
        }
      } else {
        const response = await updateUser(
          id,
          firstName,
          lastName,
          username,
          level,
        );

        if (response.success) {
          toast.success(translateMessage(response.message));
          fetchData();
          handleCloseModal();
        } else {
          toast.error(translateMessage(response.message));
        }
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const user = users.find((u: User) => u.id === id);

      if (!user) {
        toast.error("ไม่พบผู้ใช้");
        return;
      }

      setId(user.id);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setUsername(user.username);
      setLevel(user.level);

      setIsShowModal(true);
    } catch (error: unknown) {
      return toast.error(extractErrorMessage(error));
    }
  };

  const handleRemove = (id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await removeUser(deleteId);

      if (response.success) {
        toast.success("ลบข้อมูลสำเร็จ");
        fetchData();
      } else {
        toast.error(translateMessage(response.message));
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleClearForm = () => {
    setId("");
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setLevel("User");
  };

  const handleOpenModal = () => {
    handleClearForm();
    setIsShowModal(true);
  };

  const handleCloseModal = () => {
    handleClearForm();
    setIsShowModal(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="shrink-0 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            ผู้ใช้งาน
          </h1>
          <p className="text-sm text-gray-600">
            จัดการข้อมูลผู้ใช้งานและสิทธิ์การเข้าถึง
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <i className="fa-solid fa-plus"></i>
          <span>เพิ่มผู้ใช้งาน</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-blue-600 to-indigo-600 text-white sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  <i className="fa-solid fa-user mr-2"></i>
                  ชื่อ
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  <i className="fa-solid fa-user mr-2"></i>
                  นามสกุล
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  <i className="fa-solid fa-id-card mr-2"></i>
                  ชื่อผู้ใช้
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  <i className="fa-solid fa-shield-halved mr-2"></i>
                  สิทธิ์
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold w-[140px]">
                  <i className="fa-solid fa-cog mr-2"></i>
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user: User, index: number) => (
                <tr
                  key={user.id}
                  className={`hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                    {user.firstName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                    {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.username}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.level === "Admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          user.level === "Admin" ? "fa-crown" : "fa-user"
                        } mr-1.5`}
                      ></i>
                      {user.level}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="inline-flex items-center justify-center w-7 h-7 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all hover:scale-110 shadow-sm hover:shadow-md"
                        title="แก้ไข"
                      >
                        <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                      <button
                        onClick={() => handleRemove(user.id)}
                        className="inline-flex items-center justify-center w-7 h-7 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all hover:scale-110 shadow-sm hover:shadow-md"
                        title="ลบ"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    <i className="fa-solid fa-inbox text-4xl mb-2 opacity-30"></i>
                    <p>ไม่มีข้อมูลผู้ใช้งาน</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="ยืนยันการลบข้อมูล"
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
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
                <i className="fa-solid fa-trash-can text-white text-5xl drop-shadow-lg"></i>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              คุณต้องการลบข้อมูลนี้ใช่หรือไม่?
            </h3>
            <p className="text-gray-600 text-base">
              หากคุณลบข้อมูลนี้ จะไม่สามารถกู้คืนได้อีก
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={cancelDelete}
              className="flex-1 bg-linear-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <i className="fa-solid fa-xmark mr-2"></i>
              ยกเลิก
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-red-500/50"
            >
              <i className="fa-solid fa-trash mr-2"></i>
              ลบข้อมูล
            </button>
          </div>

          {/* Bottom accent line */}
          <div className="mt-6 h-1 bg-linear-to-r from-red-400 via-red-500 to-red-400 rounded-full"></div>
        </div>
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={isShowModal}
        onClose={handleCloseModal}
        title={id ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน"}
        size="sm"
      >
        <div className="space-y-4">
          {/* User Icon */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
              <div className="relative bg-linear-to-br from-blue-500 to-indigo-600 rounded-full p-4 shadow-xl">
                <i className="fa-solid fa-users text-white text-3xl"></i>
              </div>
            </div>
          </div>

          {/* Name Fields - Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <i className="fa-solid fa-user text-blue-600 mr-2"></i>
                ชื่อ
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                placeholder="ระบุชื่อ"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <i className="fa-solid fa-user text-blue-600 mr-2"></i>
                นามสกุล
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                placeholder="ระบุนามสกุล"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <i className="fa-solid fa-id-card text-blue-600 mr-2"></i>
              ชื่อผู้ใช้
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              placeholder="ระบุชื่อผู้ใช้"
            />
          </div>

          {id === "" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <i className="fa-solid fa-lock text-blue-600 mr-2"></i>
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  placeholder="ระบุรหัสผ่าน"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <i className="fa-solid fa-lock text-blue-600 mr-2"></i>
                  ยืนยันรหัสผ่าน
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  placeholder="ยืนยันรหัสผ่าน"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <i className="fa-solid fa-shield-halved text-blue-600 mr-2"></i>
              สิทธิ์การใช้งาน
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            >
              {levelList.map((item: string) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-3 border-t-2 border-gray-200">
            <button
              onClick={handleCloseModal}
              className="flex-1 bg-linear-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 border border-gray-300"
              disabled={isLoading}
            >
              <i className="fa-solid fa-times mr-2"></i>
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`flex-1 ${
                id === ""
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  : "bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              } text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              <i className={`fa-solid ${isLoading ? "fa-spinner fa-spin" : "fa-save"} mr-2`}></i>
              {isLoading ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
