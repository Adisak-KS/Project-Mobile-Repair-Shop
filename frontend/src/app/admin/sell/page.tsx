"use client";

import { createSell } from "@/app/services/sellService";
import { extractErrorMessage } from "@/app/utils/errorHandler";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [serial, setSerial] = useState("");
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {};

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
    </div>
  );
}
