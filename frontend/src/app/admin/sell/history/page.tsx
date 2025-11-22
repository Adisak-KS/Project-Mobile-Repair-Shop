"use client";

import { historySell } from "@/app/services/sellService";
import { extractErrorMessage } from "@/app/utils/errorHandler";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [sellList, setSellList] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await historySell();
      setSellList(result.data);
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="shrink-0 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            ประวัติการขาย
          </h1>
          <p className="text-sm text-gray-600">
            รายการประวัติการขายสินค้าทั้งหมด
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/sell")}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>กลับ</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-blue-600 to-indigo-600 text-white sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold w-32">
                  <i className="fa-solid fa-calendar mr-2"></i>
                  วันที่
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  <i className="fa-solid fa-box mr-2"></i>
                  รายการ
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold w-32">
                  <i className="fa-solid fa-dollar-sign mr-2"></i>
                  ราคา
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold w-32">
                  <i className="fa-solid fa-print mr-2"></i>
                  พิมพ์บิล
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sellList.map((item: any, index: number) => (
                <tr
                  key={index}
                  className={`hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                    {dayjs(item.payDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {item.product.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800 font-semibold">
                    {item.price.toLocaleString()} ฿
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <a
                        href={`/admin/sell/print?id=${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-4 py-2 rounded-lg transition-all hover:scale-110 shadow-sm hover:shadow-md text-xs"
                        title="พิมพ์บิล"
                      >
                        <i className="fa-solid fa-print"></i>
                        <span>พิมพ์</span>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {sellList.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    <i className="fa-solid fa-inbox text-4xl mb-2 opacity-30"></i>
                    <p>ไม่มีประวัติการขาย</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
