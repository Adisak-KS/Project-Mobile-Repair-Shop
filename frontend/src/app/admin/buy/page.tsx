"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/app/components/ui/modal";
import { showAlertConfirmDelete } from "@/app/utils/sweetAlert";
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

  const handleRemove = async (id: string) => {
    try {
      const isConfirmed = await showAlertConfirmDelete();

      if (!isConfirmed) return;

      const response = await DeleteBuy(id);

      if (response.success) {
        fetchData();
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
      console.log("Error Delete Product :", error);
    }
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
    if (totalPage <= 7) {
      return Array.from({ length: totalPage }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];

    if (page > 3) {
      pages.push('...');
    }

    for (let i = Math.max(2, page - 1); i <= Math.min(totalPage - 1, page + 1); i++) {
      pages.push(i);
    }

    if (page < totalPage - 2) {
      pages.push('...');
    }

    if (totalPage > 1) {
      pages.push(totalPage);
    }

    return pages;
  };

  return (
    <>
      <h1 className="content-header">รายการซื้อ</h1>
      <div>
        <button
          className="btn"
          onClick={() => {
            handleClear();
            handleOpenModal();
          }}
        >
          <i className="fa-solid fa-plus mr-2"></i>
          เพิ่มรายการ
        </button>
        <button
          className="btn ms-1"
          onClick={() => exportToExcel(true)}
          disabled={isExporting}
        >
          <i className={`fa-solid ${isExporting ? 'fa-spinner fa-spin' : 'fa-file-excel'} mr-2`}></i>
          {isExporting ? 'กำลัง Export...' : 'Export หน้านี้'}
        </button>
        <button
          className="btn ms-1 bg-green-600 hover:bg-green-700"
          onClick={() => exportToExcel(false)}
          disabled={isExporting}
        >
          <i className={`fa-solid ${isExporting ? 'fa-spinner fa-spin' : 'fa-file-excel'} mr-2`}></i>
          {isExporting ? 'กำลัง Export...' : 'Export ทั้งหมด'}
        </button>
      </div>

      <Modal title="เพิ่มรายการ" isOpen={isOpen} onClose={handleCloseModal}>
        <label htmlFor="serial">Serial สินค้า</label>
        <input
          type="text"
          placeholder="ระบุ Serial สินค้า"
          maxLength={50}
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
        />

        <label htmlFor="name">ชื่อสินค้า</label>
        <input
          type="text"
          placeholder="ระบุชื่อสินค้า"
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="release">รุ่น</label>
        <input
          type="text"
          placeholder="ระบุรุ่น"
          maxLength={100}
          value={release}
          onChange={(e) => setRelease(e.target.value)}
        />

        <label htmlFor="color">สี</label>
        <input
          type="text"
          placeholder="ระบุสี"
          maxLength={50}
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <label htmlFor="price">ราคา</label>
        <input
          type="number"
          placeholder="ระบุราคา"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
        />

        <label htmlFor="customerName">ชื่อลูกค้า</label>
        <input
          type="text"
          placeholder="ระบุชื่อลูกค้า"
          maxLength={50}
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <label htmlFor="phone">เบอร์โทรศัพท์</label>
        <input
          type="text"
          placeholder="ระบุเบอร์โทรศัพท์"
          maxLength={50}
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />

        <label htmlFor="address">ที่อยู่</label>
        <input
          type="text"
          placeholder="ระบุที่อยู่"
          maxLength={200}
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
        />

        <label htmlFor="remark">หมายเหตุ</label>
        <input
          type="text"
          placeholder="ระบุหมายเหตุ เพิ่มเติม"
          maxLength={200}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />

        <label htmlFor="qty">จำนวนสินค้า</label>
        <input
          type="number"
          placeholder="ระบุจำนวน"
          min={1}
          value={qty}
          onChange={(e) => setQty(e.target.value === "" ? "" : Number(e.target.value))}
        />

        <div className="mt-2 block">
          <button className="btn" onClick={handleSave} disabled={isLoading}>
            <i className="fa-solid fa-save mr-2"></i>
            {isLoading ? "กำลังบันทึก" : "บันทึก"}
          </button>
        </div>
      </Modal>

      <div className="mt-4 bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อสินค้า
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  รุ่น
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  สี
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ราคา
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  ลูกค้า
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  เบอร์โทรศัพท์
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden 2xl:table-cell">
                  หมายเหตุ
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    <i className="fa-solid fa-inbox text-4xl mb-2 text-gray-300"></i>
                    <p>ไม่พบข้อมูล</p>
                  </td>
                </tr>
              ) : (
                products.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.serial || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                      {item.release}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                      {item.color}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-green-600">
                      ฿{item.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 hidden xl:table-cell">
                      {item.customerName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 hidden xl:table-cell">
                      {item.customerPhone}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden 2xl:table-cell max-w-xs truncate">
                      {item.remark || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          title="แก้ไข"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          title="ลบ"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-semibold text-gray-700">รายการทั้งหมด:</span>
              <span className="ml-2 text-blue-600 font-bold">{totalRows}</span>
              <span className="ml-1 text-gray-500">รายการ</span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="text-sm text-gray-600">
              หน้า <span className="font-semibold text-gray-900">{page}</span> / <span className="font-semibold text-gray-900">{totalPage}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="limit" className="text-sm text-gray-600 whitespace-nowrap">
              แสดงผล:
            </label>
            <select
              id="limit"
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
            >
              <option value={5}>5 รายการ</option>
              <option value={10}>10 รายการ</option>
              <option value={20}>20 รายการ</option>
              <option value={50}>50 รายการ</option>
              <option value={100}>100 รายการ</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          <button
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
          >
            <i className="fa-solid fa-angles-left mr-1"></i>
            <span className="hidden sm:inline">หน้าแรก</span>
          </button>
          <button
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div className="flex gap-1">
            {getPageNumbers().map((pageNum, idx) => (
              pageNum === '...' ? (
                <span className="px-3 py-2 text-gray-500" key={`dots-${idx}`}>
                  ...
                </span>
              ) : (
                <button
                  className={`min-w-10 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    pageNum === page
                      ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handlePageChange(pageNum as number)}
                  key={pageNum}
                >
                  {pageNum}
                </button>
              )
            ))}
          </div>

          <button
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPage}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
          <button
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            onClick={() => handlePageChange(totalPage)}
            disabled={page === totalPage}
          >
            <span className="hidden sm:inline">หน้าสุดท้าย</span>
            <i className="fa-solid fa-angles-right ml-1"></i>
          </button>
        </div>
      </div>
    </>
  );
}
