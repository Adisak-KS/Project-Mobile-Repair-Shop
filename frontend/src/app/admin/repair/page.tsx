"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { extractErrorMessage } from "@/app/utils/errorHandler";
import Modal from "@/app/components/ui/modal";
import {
  createService,
  listService,
  removeService,
  updateService,
} from "@/app/services/serviceService";

export default function Page() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [remark, setRemark] = useState("");
  const [id, setId] = useState("");
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await listService();
      setRepairs(response.data);
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      let response;

      if (id !== "") {
        response = await updateService(id, name, price, remark);
      } else {
        response = await createService(name, price, remark);
      }

      if (response.success) {
        toast.success(response.message);
        handleClearForm();
        fetchData();
        handleCloseModal();
      } else {
        toast.error(response.message);
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const repair = repairs.find((repair: any) => repair.id === id) as any;

      if (repair) {
        setId(repair.id);
        setName(repair.name);
        setPrice(repair.price);
        setRemark(repair.remark);

        setIsShowModal(true);
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleRemove = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await removeService(deleteId);
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

  const handleClearForm = () => {
    setId("");
    setName("");
    setPrice(0);
    setRemark("");
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
            งานบริการ
          </h1>
          <p className="text-sm text-gray-600">
            จัดการรายการบริการและราคา
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <i className="fa-solid fa-plus"></i>
          <span>เพิ่มงานบริการ</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-blue-600 to-indigo-600 text-white sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  <i className="fa-solid fa-screwdriver-wrench mr-2"></i>
                  ชื่องานบริการ
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  <i className="fa-solid fa-dollar-sign mr-2"></i>
                  ราคา
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  <i className="fa-solid fa-note-sticky mr-2"></i>
                  หมายเหตุ
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  <i className="fa-solid fa-calendar mr-2"></i>
                  วันที่บันทึก
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold w-[140px]">
                  <i className="fa-solid fa-cog mr-2"></i>
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {repairs.map((repair: any, index: number) => (
                <tr
                  key={repair.id}
                  className={`hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                    {repair.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800 font-semibold">
                    {repair.price.toLocaleString()} ฿
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {repair.remark || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {dayjs(repair.payDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleUpdate(repair.id)}
                        className="inline-flex items-center justify-center w-7 h-7 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all hover:scale-110 shadow-sm hover:shadow-md"
                        title="แก้ไข"
                      >
                        <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                      <button
                        onClick={() => handleRemove(repair.id)}
                        className="inline-flex items-center justify-center w-7 h-7 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all hover:scale-110 shadow-sm hover:shadow-md"
                        title="ลบ"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {repairs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    <i className="fa-solid fa-inbox text-4xl mb-2 opacity-30"></i>
                    <p>ไม่มีข้อมูลงานบริการ</p>
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

      <Modal
        isOpen={isShowModal}
        onClose={handleCloseModal}
        title={id !== "" ? "แก้ไขงานบริการ" : "เพิ่มงานบริการ"}
        size="sm"
      >
        <div className="space-y-4">
          {/* Service Icon */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
              <div className="relative bg-linear-to-br from-blue-500 to-indigo-600 rounded-full p-4 shadow-xl">
                <i className="fa-solid fa-screwdriver-wrench text-white text-3xl"></i>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <i className="fa-solid fa-screwdriver-wrench text-blue-600 mr-2"></i>
              ชื่องานบริการ
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              placeholder="ระบุชื่องานบริการ"
            />
          </div>

          <div>
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <i className="fa-solid fa-note-sticky text-amber-600 mr-2"></i>
              หมายเหตุ
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm resize-none"
              placeholder="ระบุหมายเหตุ (ถ้ามี)"
            />
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
                id !== ""
                  ? "bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  : "bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
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
