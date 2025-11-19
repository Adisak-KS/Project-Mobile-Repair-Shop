"use client";

import { infoSell } from "@/app/services/sellService";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [sell, setSell] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async (): Promise<void> => {
    if (!id) return;
    const result = await infoSell(id);
    setSell(result.data);
    printDocument();
  };

  const printDocument = () => {
    // Add Css Style for print
    const style = document.createElement("style");
    style.textContent = `
        @media print {
            body * {
                visibility: hidden;
            }

            #print-content,
            #print-content * {
                  visibility: visible;
            }
            #print-content{
                position: absolute;
                left:0;
                top:0;
                width: 80mm;
                height: 100%;
            }
            .content-header{
                display: none;
            }
        }
    `;

    document.head.appendChild(style);

    // print
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div>
      <div className="content-header flex justify-between">
        <div>พิมพ์บิล</div>
        <div>
          <button className="btn btn-primary text-xl" onClick={printDocument}>
            <i className="fa-solid fa-print mr-3"></i>
            พิมพ์บิล
          </button>
        </div>
      </div>

      <div id="print-content">
        <div className="text-2xl font-bold text-center">ใบเสร็จรับเงิน</div>
        <div className="text-left">
          วันที่ {dayjs(sell?.payDate).format("DD/MM/YYYY")}
        </div>
        <div className="text-left">รายการ : {sell?.product.name}</div>
        <div className="text-left">ราคา : {sell?.price.toLocaleString()}</div>
        <div className="text-left">วันที่ออกบิล : {dayjs(sell?.payDate).format('DD/MM/YYYY')}</div>
      </div>
    </div>
  );
}
