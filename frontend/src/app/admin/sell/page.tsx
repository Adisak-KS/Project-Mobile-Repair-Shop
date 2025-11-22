"use client";

import {
  confirmSell,
  createSell,
  listSell,
  removeSell,
} from "@/app/services/sellService";
import { extractErrorMessage } from "@/app/utils/errorHandler";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/ui/modal";

export default function Page() {
  const [serial, setSerial] = useState("");
  const [price, setPrice] = useState(0);
  const [sells, setSells] = useState([]);
  const [id, setId] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showSellConfirm, setShowSellConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await listSell();
      setSells(response.data);

      let total = 0;
      for (let i = 0; i < response.data.length; i++) {
        total += response.data[i].price;
      }

      setTotalAmount(total);
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await createSell(serial, price);

      if (response.success) {
        toast.success(response.message);
        fetchData();
      } else {
        toast.error(response.message);
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await removeSell(deleteId);
      if (response.success) {
        toast.success("ลบข้อมูลสำเร็จ");
        fetchData();
      } else {
        toast.error(response.message);
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

  const handleConfirm = () => {
    setShowSellConfirm(true);
  };

  const confirmSellAction = async () => {
    try {
      const response = await confirmSell();

      if (response.success) {
        toast.success(response.message);
        fetchData();
        setSerial("");
        setPrice(0);
      } else {
        toast.error(response.message);
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    } finally {
      setShowSellConfirm(false);
    }
  };

  const cancelSell = () => {
    setShowSellConfirm(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="shrink-0 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            ขายสินค้า
          </h1>
          <p className="text-sm text-gray-600">
            จัดการรายการขายสินค้าและบันทึกยอดขาย
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/sell/history")}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <i className="fa-solid fa-file-alt"></i>
          <span>ประวัติการขาย</span>
        </button>
      </div>

      {/* Input Form Section */}
      <div className="shrink-0 mb-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <i className="fa-solid fa-barcode text-blue-600 mr-2"></i>
              Serial
            </label>
            <input
              type="text"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              placeholder="ระบุ Serial Number"
            />
          </div>
          <div className="w-full sm:w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <i className="fa-solid fa-dollar-sign text-green-600 mr-2"></i>
              ราคา
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              placeholder="ระบุราคา"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <i className={`fa-solid ${isLoading ? "fa-spinner fa-spin" : "fa-save"}`}></i>
            <span>{isLoading ? "กำลังบันทึก..." : "บันทึก"}</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-blue-600 to-indigo-600 text-white sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  <i className="fa-solid fa-barcode mr-2"></i>
                  Serial
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  <i className="fa-solid fa-box mr-2"></i>
                  รายการสินค้า
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  <i className="fa-solid fa-dollar-sign mr-2"></i>
                  ราคา
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  <i className="fa-solid fa-cog mr-2"></i>
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sells.map((item: any, index: number) => (
                <tr
                  key={item.id}
                  className={`hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                    {item.product.serial}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {item.product.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800 font-semibold">
                    {item.price.toLocaleString()} ฿
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center justify-center w-7 h-7 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all hover:scale-110 shadow-sm hover:shadow-md"
                        title="ลบ"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sells.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    <i className="fa-solid fa-inbox text-4xl mb-2 opacity-30"></i>
                    <p>ยังไม่มีรายการขาย</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        {sells.length > 0 && (
          <div className="shrink-0 border-t-2 border-gray-200 bg-linear-to-r from-gray-50 to-white p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-calculator text-2xl text-blue-600"></i>
                <div>
                  <p className="text-sm text-gray-600 font-medium">ยอดรวมทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {totalAmount.toLocaleString()} ฿
                  </p>
                </div>
              </div>
              <button
                onClick={handleConfirm}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <i className="fa-solid fa-check"></i>
                <span>ยืนยันการขาย</span>
              </button>
            </div>
          </div>
        )}
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
              คุณต้องการลบรายการนี้ใช่หรือไม่?
            </h3>
            <p className="text-gray-600 text-base">
              หากคุณลบรายการนี้ จะไม่สามารถกู้คืนได้อีก
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
              ลบรายการ
            </button>
          </div>

          {/* Bottom accent line */}
          <div className="mt-6 h-1 bg-linear-to-r from-red-400 via-red-500 to-red-400 rounded-full"></div>
        </div>
      </Modal>

      {/* Sell Confirmation Modal */}
      <Modal
        title="ยืนยันการขาย"
        isOpen={showSellConfirm}
        onClose={cancelSell}
        size="sm"
      >
        <div className="relative">
          {/* Animated Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Pulse rings */}
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-50"></div>

              {/* Main icon */}
              <div className="relative bg-linear-to-br from-green-500 to-emerald-600 rounded-full p-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <i className="fa-solid fa-check-circle text-white text-5xl drop-shadow-lg"></i>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              ยืนยันการขายสินค้า?
            </h3>
            <p className="text-gray-600 text-base mb-4">
              ยอดรวมทั้งหมด: <span className="font-bold text-gray-800">{totalAmount.toLocaleString()} ฿</span>
            </p>
            <p className="text-gray-600 text-base">
              กรุณาตรวจสอบรายการให้ถูกต้องก่อนยืนยัน
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={cancelSell}
              className="flex-1 bg-linear-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <i className="fa-solid fa-xmark mr-2"></i>
              ยกเลิก
            </button>
            <button
              onClick={confirmSellAction}
              className="flex-1 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-green-500/50"
            >
              <i className="fa-solid fa-check mr-2"></i>
              ยืนยันการขาย
            </button>
          </div>

          {/* Bottom accent line */}
          <div className="mt-6 h-1 bg-linear-to-r from-green-400 via-emerald-500 to-green-400 rounded-full"></div>
        </div>
      </Modal>
    </div>
  );
}
