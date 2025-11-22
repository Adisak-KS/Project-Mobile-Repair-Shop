"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/app/components/ui/modal";
import {
  createBuy,
  DeleteBuy,
  exportToExcelSell,
  listProduct,
  updateBuy,
} from "@/app/services/buyService";
import { validateCreateBuy } from "@/app/utils/validation";
import { extractErrorMessage } from "@/app/utils/errorHandler";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [serial, setSerial] = useState("");
  const [name, setName] = useState("");
  const [release, setRelease] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState<number | "">(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [remark, setRemark] = useState("");

  const [products, setProducts] = useState<any[]>([]); // สินค้าที่ซื้อ
  const [id, setId] = useState<string | null>(null); // id เอาไว้ Update รายการ
  const [qty, setQty] = useState<number | "">(1);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await listProduct(page, limit);
      setProducts(response.data);
      setTotalRows(response.pagination.totalItems);
      setTotalPage(response.pagination.totalPages);
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [page, limit, fetchData]);

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSave = async () => {
    const priceValue = price === "" ? 0 : Number(price);
    const qtyValue = qty === "" ? 1 : Number(qty);

    const errorValidate = validateCreateBuy(
      serial,
      name,
      release,
      color,
      priceValue,
      customerName,
      customerPhone,
      customerAddress
    );

    if (errorValidate) {
      return toast.error(errorValidate);
    }

    try {
      setIsLoading(true);
      let response;
      if (!id) {
        response = await createBuy(
          serial,
          name,
          release,
          color,
          priceValue,
          customerName,
          customerPhone,
          customerAddress,
          remark,
          qtyValue
        );
      } else {
        response = await updateBuy(
          id,
          serial,
          name,
          release,
          color,
          priceValue,
          customerName,
          customerPhone,
          customerAddress,
          remark
        );
      }

      if (response.success) {
        fetchData();
        handleCloseModal();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    const product = products.find((item: any) => item.id === id);

    if (!product) {
      toast.error("ไม่พบ ID ของรายการ");
      return;
    }
    setSerial(product.serial);
    setName(product.name);
    setRelease(product.release);
    setColor(product.color);
    setPrice(product.price);
    setCustomerName(product.customerName);
    setCustomerPhone(product.customerPhone);
    setCustomerAddress(product.customerAddress);
    setRemark(product.remark);
    setId(product.id);

    handleOpenModal();
  };

  const handleRemove = (id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await DeleteBuy(deleteId);

      if (response.success) {
        toast.success("ลบข้อมูลสำเร็จ");
        fetchData();
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
      console.log("Error Delete Product :", error);
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleClear = () => {
    setSerial("");
    setName("");
    setRelease("");
    setColor("");
    setPrice(0);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setRemark("");
    setId(null);
    setQty(1);
  };

  const exportToExcel = async (currentPageOnly: boolean) => {
    if (isExporting) return; // Prevent double click

    try {
      setIsExporting(true);
      const result = await exportToExcelSell(currentPageOnly ? page : undefined);
      const blob = result.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Products_${currentPageOnly ? `Page${page}_` : "All_"}${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`Export Excel ${currentPageOnly ? 'หน้านี้' : 'ทั้งหมด'} สำเร็จ`);
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
      console.log("Error Export Excel:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPage) return;
    setPage(newPage);
  };

  const getPageNumbers = () => {
    if (totalPage <= 3) {
      return Array.from({ length: totalPage }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    if (page === 1) {
      // หน้าแรก: แสดง 1, 2, 3
      pages.push(1, 2, 3);
    } else if (page === totalPage) {
      // หน้าสุดท้าย: แสดง totalPage-2, totalPage-1, totalPage
      pages.push(totalPage - 2, totalPage - 1, totalPage);
    } else {
      // หน้ากลาง: แสดง page-1, page, page+1
      pages.push(page - 1, page, page + 1);
    }

    return pages;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="shrink-0 p-4 bg-gray-50">
        <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">รายการซื้อ</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              handleClear();
              handleOpenModal();
            }}
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i>
            เพิ่มรายการ
          </button>
          <button
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => exportToExcel(true)}
            disabled={isExporting}
          >
            <i className={`fa-solid ${isExporting ? 'fa-spinner fa-spin' : 'fa-file-excel'} mr-2 text-xs`}></i>
            {isExporting ? 'กำลัง Export...' : 'Export หน้านี้'}
          </button>
          <button
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => exportToExcel(false)}
            disabled={isExporting}
          >
            <i className={`fa-solid ${isExporting ? 'fa-spinner fa-spin' : 'fa-file-excel'} mr-2 text-xs`}></i>
            {isExporting ? 'กำลัง Export...' : 'Export ทั้งหมด'}
          </button>
        </div>
      </div>

      <Modal title={id ? "แก้ไขรายการซื้อ" : "เพิ่มรายการซื้อ"} isOpen={isOpen} onClose={handleCloseModal} size="md">
        <div className="space-y-5">
          {/* Product Information Section */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-mobile-screen-button text-blue-600"></i>
              ข้อมูลสินค้า
            </h3>

            <div className="space-y-3">
              <div>
                <label htmlFor="serial" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  <i className="fa-solid fa-hashtag text-indigo-600 mr-1.5"></i>
                  Serial สินค้า
                </label>
                <input
                  type="text"
                  id="serial"
                  placeholder="ระบุ Serial สินค้า"
                  maxLength={50}
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  <i className="fa-solid fa-tag text-indigo-600 mr-1.5"></i>
                  ชื่อสินค้า
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="ระบุชื่อสินค้า"
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="release" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    <i className="fa-solid fa-box text-indigo-600 mr-1.5"></i>
                    รุ่น
                  </label>
                  <input
                    type="text"
                    id="release"
                    placeholder="ระบุรุ่น"
                    maxLength={100}
                    value={release}
                    onChange={(e) => setRelease(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="color" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    <i className="fa-solid fa-palette text-indigo-600 mr-1.5"></i>
                    สี
                  </label>
                  <input
                    type="text"
                    id="color"
                    placeholder="ระบุสี"
                    maxLength={50}
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="price" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    <i className="fa-solid fa-dollar-sign text-emerald-600 mr-1.5"></i>
                    ราคา
                  </label>
                  <input
                    type="number"
                    id="price"
                    placeholder="ระบุราคา"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="qty" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    <i className="fa-solid fa-boxes-stacked text-emerald-600 mr-1.5"></i>
                    จำนวน
                  </label>
                  <input
                    type="number"
                    id="qty"
                    placeholder="ระบุจำนวน"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Section */}
          <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <h3 className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-user text-purple-600"></i>
              ข้อมูลลูกค้า
            </h3>

            <div className="space-y-3">
              <div>
                <label htmlFor="customerName" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  <i className="fa-solid fa-id-card text-purple-600 mr-1.5"></i>
                  ชื่อลูกค้า
                </label>
                <input
                  type="text"
                  id="customerName"
                  placeholder="ระบุชื่อลูกค้า"
                  maxLength={50}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  <i className="fa-solid fa-phone text-purple-600 mr-1.5"></i>
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="text"
                  id="phone"
                  placeholder="ระบุเบอร์โทรศัพท์"
                  maxLength={50}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  <i className="fa-solid fa-location-dot text-purple-600 mr-1.5"></i>
                  ที่อยู่
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="ระบุที่อยู่"
                  maxLength={200}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
            <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-note-sticky text-amber-600"></i>
              ข้อมูลเพิ่มเติม
            </h3>

            <div>
              <label htmlFor="remark" className="block text-xs font-semibold text-gray-700 mb-1.5">
                <i className="fa-solid fa-message text-amber-600 mr-1.5"></i>
                หมายเหตุ
              </label>
              <textarea
                id="remark"
                placeholder="ระบุหมายเหตุเพิ่มเติม"
                maxLength={200}
                rows={3}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 border-t-2 border-gray-200">
            <button
              onClick={handleCloseModal}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-gray-700 bg-linear-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg transition-all border border-gray-300 shadow-sm"
              disabled={isLoading}
            >
              <i className="fa-solid fa-xmark mr-2 text-xs"></i>
              ยกเลิก
            </button>
            <button
              className={`flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                id
                  ? "bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:ring-amber-500"
                  : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500"
              }`}
              onClick={handleSave}
              disabled={isLoading}
            >
              <i className={`fa-solid ${isLoading ? 'fa-spinner fa-spin' : id ? 'fa-pen' : 'fa-save'} mr-2 text-xs`}></i>
              {isLoading ? "กำลังบันทึก..." : id ? "บันทึกการแก้ไข" : "บันทึก"}
            </button>
          </div>
        </div>
      </Modal>

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

      <div className="flex-1 flex flex-col mx-4 mb-4 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-linear-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold">
                  Serial
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold">
                  ชื่อสินค้า
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold hidden md:table-cell">
                  รุ่น
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold hidden lg:table-cell">
                  สี
                </th>
                <th className="px-3 py-3.5 text-right text-sm font-semibold">
                  ราคา
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold hidden xl:table-cell">
                  ลูกค้า
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold hidden xl:table-cell">
                  เบอร์โทร
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold hidden 2xl:table-cell">
                  หมายเหตุ
                </th>
                <th className="px-3 py-3.5 text-center text-sm font-semibold w-20">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <i className="fa-solid fa-inbox text-4xl mb-2"></i>
                      <p className="text-sm font-medium">ไม่พบข้อมูล</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((item: any, index: number) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-blue-50/50 transition-all duration-150 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-600">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded font-medium">
                        {item.serial || <span className="text-gray-400">N/A</span>}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-600 hidden md:table-cell">
                      {item.release}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-xs hidden lg:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                        {item.color}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm text-right">
                      <span className="font-bold text-emerald-600">
                        ฿{item.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-700 hidden xl:table-cell">
                      <div className="flex items-center gap-1.5">
                        <i className="fa-solid fa-user text-blue-500 text-xs"></i>
                        <span className="font-medium">{item.customerName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-600 hidden xl:table-cell">
                      <div className="flex items-center gap-1.5">
                        <i className="fa-solid fa-phone text-emerald-500 text-xs"></i>
                        <span className="font-medium">{item.customerPhone}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-600 hidden 2xl:table-cell max-w-xs">
                      <div className="truncate" title={item.remark}>
                        {item.remark || <span className="text-gray-400 italic">ไม่มี</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-sm sticky right-0 bg-white">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="inline-flex items-center justify-center w-7 h-7 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all hover:scale-110 shadow-sm hover:shadow-md"
                          title="แก้ไข"
                        >
                          <i className="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="inline-flex items-center justify-center w-7 h-7 bg-linear-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all hover:scale-110 shadow-sm hover:shadow-md"
                          title="ลบ"
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="shrink-0 border-t border-gray-200 bg-linear-to-r from-gray-50 to-white p-3">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5 text-xs font-medium text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="text-gray-500">ทั้งหมด</span>
              <strong className="text-blue-600 text-sm">{totalRows}</strong>
              <span className="text-gray-500">รายการ</span>
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1.5">
              <span className="text-gray-500">หน้า</span>
              <strong className="text-indigo-600 text-sm">{page}</strong>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">{totalPage}</span>
            </span>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5">
              <select
                className="px-2.5 py-1 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white hover:border-gray-400 transition-colors"
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-gray-500">ต่อหน้า</span>
            </div>
          </div>

          <div className="flex gap-1.5">
            <button
              className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-300 transition-all shadow-sm"
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              title="หน้าแรก"
            >
              <i className="fa-solid fa-angles-left"></i>
            </button>
            <button
              className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-300 transition-all shadow-sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              title="ก่อนหน้า"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            {getPageNumbers().map((pageNum, idx) => (
              pageNum === '...' ? (
                <span className="px-2 py-1.5 text-gray-400 text-xs" key={`dots-${idx}`}>...</span>
              ) : (
                <button
                  className={`min-w-8 px-3 py-1.5 text-xs font-bold rounded-md border transition-all shadow-sm ${
                    pageNum === page
                      ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white border-blue-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                  }`}
                  onClick={() => handlePageChange(pageNum as number)}
                  key={pageNum}
                >
                  {pageNum}
                </button>
              )
            ))}

            <button
              className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-300 transition-all shadow-sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPage}
              title="ถัดไป"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
            <button
              className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-300 transition-all shadow-sm"
              onClick={() => handlePageChange(totalPage)}
              disabled={page === totalPage}
              title="หน้าสุดท้าย"
            >
              <i className="fa-solid fa-angles-right"></i>
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
