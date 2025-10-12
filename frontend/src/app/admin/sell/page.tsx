"use client";

import {
  confirmSell,
  createSell,
  listSell,
  removeSell,
} from "@/app/services/sellService";
import { extractErrorMessage } from "@/app/utils/errorHandler";
import {
  showAlertConfirmDelete,
  showAlertConfirmSell,
} from "@/app/utils/sweetAlert";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [serial, setSerial] = useState("");
  const [price, setPrice] = useState(0);
  const [sells, setSells] = useState([]); // ข้อมูลทั้งหมด
  const [id, setId] = useState(0); // ข้อมูล id สำหรับแก้ไข ลบ
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleDelete = async (id: number) => {
    try {
      const isConfirmed = await showAlertConfirmDelete();

      if (!isConfirmed) {
        // กดยกเลิก → ไม่ทำอะไร
        return;
      }

      const response = await removeSell(id);
      if (response.success) {
        toast.success(response.message);
        fetchData();
      } else {
        toast.error(response.message);
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleConfirm = async () => {
    try {
      const isConfirmed = await showAlertConfirmSell();

      if (!isConfirmed) {
        // กดยกเลิก → ไม่ทำอะไร
        return;
      }

      const response = await confirmSell();

      if (response.success) {
        toast.success(response.message);
        fetchData();
      } else {
        toast.error(response.message);
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="content-header">ขายสินค้า</div>
      <div className="flex gap-2 items-end">
        <div className="w-full">
          <label htmlFor="Serial">Serial</label>
          <input
            type="text"
            onChange={(e) => setSerial(e.target.value)}
            className="form-control"
            placeholder="serial"
          />
        </div>
        <div className="text-right">
          <label htmlFor="">ราคา</label>
          <input
            type="number"
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="btn flex items-center"
        >
          <i className="fa-solid fa-save mr-2"></i>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>

      <table className="table mt-6">
        <thead>
          <tr>
            <th className="text-left">Serial</th>
            <th className="text-left">รายการสินค้า</th>
            <th className="text-right pr-0t">ราคา</th>
            <th className="w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {sells.map((item: any) => (
            <tr key={item.id}>
              <td>{item.product.serial}</td>
              <td>{item.product.name}</td>
              <td className="text-eight">{item.price.toLocaleString()}</td>
              <td className="text-center">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn-delete"
                >
                  <i className="fa-solid fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sells.length > 0 && (
        <>
          <div className="mt-5 flex justify-between">
            <div>ยอดรวมทั้งหมด</div>
            <div className="text-right font-bold bg-gray-300 px-4 py-2 rounded-md">
              {totalAmount.toLocaleString()}
            </div>
          </div>
          <div className="mt-5 text-center">
            <button className="btn" onClick={handleConfirm}>
              <i className="fa-solid fa-check mr-2"></i>
              ยืนยันการขาย
            </button>
          </div>
        </>
      )}
    </div>
  );
}
