"use client";

import { infoSell } from "@/app/services/sellService";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [sell, setSell] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    if (!id) return;
    try {
      setIsLoading(true);
      const result = await infoSell(id);
      setSell(result.data);
      // Auto print after data loaded
      setTimeout(() => {
        printDocument();
      }, 500);
    } catch (error) {
      console.error("Error fetching sell info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const printDocument = () => {
    // Add Css Style for print
    const existingStyle = document.getElementById("print-style");
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement("style");
    style.id = "print-style";
    style.textContent = `
        @media print {
            @page {
                size: 80mm auto;
                margin: 0;
            }

            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }

            body {
                margin: 0 !important;
                padding: 0 !important;
            }

            body * {
                visibility: hidden !important;
            }

            #print-content,
            #print-content * {
                visibility: visible !important;
            }

            #print-content {
                position: static !important;
                width: 80mm !important;
                max-width: 80mm !important;
                padding: 5mm !important;
                margin: 0 auto !important;
                border-radius: 0 !important;
                box-shadow: none !important;
                border: none !important;
                background: white !important;
                page-break-inside: avoid !important;
            }

            #print-content * {
                border-radius: 0 !important;
            }

            .content-header {
                display: none !important;
            }

            .no-print {
                display: none !important;
            }

            .print-hide-bg {
                background: transparent !important;
            }

            .print-footer {
                page-break-inside: avoid !important;
                visibility: visible !important;
                display: block !important;
            }

            /* Ensure all content is visible */
            html, body {
                height: auto !important;
                overflow: visible !important;
                min-height: auto !important;
            }

            /* Force footer to show */
            .print-footer * {
                visibility: visible !important;
                display: block !important;
            }
        }
    `;

    document.head.appendChild(style);

    // print
    setTimeout(() => {
      window.print();
    }, 200);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!sell) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-exclamation-triangle text-4xl text-yellow-600 mb-4"></i>
          <p className="text-gray-600 font-medium">ไม่พบข้อมูลบิล</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      {/* Modern Header - Only visible on screen */}
      <div className="content-header mb-4 sm:mb-6 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1 truncate">
              พิมพ์บิลขายสินค้า
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              ใบเสร็จรับเงิน #{sell?.id?.slice(0, 8)}
            </p>
          </div>
          <button
            onClick={printDocument}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
          >
            <i className="fa-solid fa-print"></i>
            <span>พิมพ์บิล</span>
          </button>
        </div>
      </div>

      {/* Bill Content - Printable */}
      <div id="print-content" className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8 max-w-full sm:max-w-lg md:max-w-2xl mx-auto">
        {/* Company Header */}
        <div className="text-center mb-3 sm:mb-4 pb-3 sm:pb-4 border-b-2 border-dashed border-gray-300">
          <div className="mb-2">
            <i className="fa-solid fa-store text-2xl sm:text-3xl text-blue-600 mb-1 sm:mb-2 block"></i>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">ร้านซ่อมมือถือ</h2>
          </div>
          <p className="text-xs text-gray-500">เลขที่ 123 ถนนสุขุมวิท กรุงเทพฯ 10110</p>
          <p className="text-xs text-gray-500">โทร: 02-123-4567</p>
        </div>

        {/* Receipt Title */}
        <div className="text-center mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">ใบเสร็จรับเงิน</h3>
          <p className="text-xs text-gray-500">RECEIPT</p>
          <p className="text-xs text-gray-600 mt-1">เลขที่: {sell?.id?.slice(0, 8)}</p>
        </div>

        {/* Bill Info */}
        <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-dashed border-gray-300">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">วันที่:</p>
              <p className="font-semibold text-gray-800 text-xs sm:text-sm break-all">
                {dayjs(sell?.payDate).format("DD/MM/YYYY HH:mm")} น.
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-0.5">พนักงานขาย:</p>
              <p className="font-semibold text-gray-800 text-xs sm:text-sm">Admin</p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        {sell?.customer && (
          <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-dashed border-gray-300">
            <p className="text-xs font-semibold text-gray-700 mb-2">ข้อมูลลูกค้า:</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-xs text-gray-600 flex-shrink-0">ชื่อ:</span>
                <span className="font-medium text-gray-800 text-xs sm:text-sm text-right break-all">{sell.customer.name}</span>
              </div>
              {sell.customer.phone && (
                <div className="flex justify-between gap-2">
                  <span className="text-xs text-gray-600 flex-shrink-0">โทร:</span>
                  <span className="font-medium text-gray-800 text-xs sm:text-sm text-right">{sell.customer.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Details */}
        <div className="mb-3 sm:mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">รายการสินค้า:</p>
          <div className="print-hide-bg bg-gray-50 rounded-lg p-3 mb-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-xs text-gray-600 flex-shrink-0">ชื่อสินค้า:</span>
                <span className="font-semibold text-gray-800 text-xs sm:text-sm text-right break-all">{sell?.product?.name}</span>
              </div>
              {sell?.product?.release && (
                <div className="flex justify-between gap-2">
                  <span className="text-xs text-gray-600 flex-shrink-0">รุ่น:</span>
                  <span className="font-medium text-gray-800 text-xs sm:text-sm text-right break-all">{sell.product.release}</span>
                </div>
              )}
              {sell?.product?.color && (
                <div className="flex justify-between gap-2">
                  <span className="text-xs text-gray-600 flex-shrink-0">สี:</span>
                  <span className="font-medium text-gray-800 text-xs sm:text-sm text-right">{sell.product.color}</span>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <span className="text-xs text-gray-600 flex-shrink-0">Serial:</span>
                <span className="font-mono text-xs text-gray-800 text-right break-all">{sell?.product?.serial}</span>
              </div>
              <div className="flex justify-between gap-2 pt-1 border-t border-gray-200">
                <span className="text-xs text-gray-600 flex-shrink-0">ราคา:</span>
                <span className="font-semibold text-gray-800 text-xs sm:text-sm">{sell?.price?.toLocaleString()} ฿</span>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-blue-600 text-white rounded-lg p-3">
            <div className="flex justify-between items-center gap-2">
              <span className="text-sm sm:text-base font-bold">ยอดรวมทั้งหมด:</span>
              <span className="text-xl sm:text-2xl font-bold">{sell?.price?.toLocaleString()} ฿</span>
            </div>
          </div>
        </div>

        {/* Remark */}
        {sell?.remark && (
          <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-dashed border-gray-300">
            <p className="text-xs font-semibold text-gray-700 mb-1">หมายเหตุ:</p>
            <p className="text-xs text-gray-600 break-words">{sell.remark}</p>
          </div>
        )}

        {/* Footer - Always visible */}
        <div className="text-center pt-3 sm:pt-4 border-t-2 border-dashed border-gray-300 print-footer">
          <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
            ขอบคุณที่ใช้บริการ
          </p>
          <p className="text-xs text-gray-500 mb-1">
            เอกสารนี้ออกโดยระบบอัตโนมัติ
          </p>
          <div className="mt-2 sm:mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
            <i className="fa-solid fa-globe"></i>
            <span>www.mobileshop.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
