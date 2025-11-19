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
    <div>
      <div className="content-header">
        <div>ประวัติการขาย</div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th className="text-left w-[120px]">วันที่</th>
            <th className="text-left">รายการ</th>
            <th className="text-right w-[120px]">ราคา</th>
            <th className="text-center w-[140px]">พิมพ์บิล</th>
          </tr>
        </thead>
        <tbody>
          {sellList.map((item: any, index: number) => (
            <tr key={index}>
              <td>{dayjs(item.payDate).format("DD/MM/YYYY")}</td>
              <td>{item.product.name}</td>
              <td className="text-right">{item.price.toLocaleString()}</td>
              <td className="text-center">
                <a
                  className="btn btn-sm btn-primary"
                  href={`/admin/sell/print?id=${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-solid fa-print mr-2"></i>
                  พิมพ์
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
