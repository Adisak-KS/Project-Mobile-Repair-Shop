"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/app/components/ui/modal";
import { showAlertConfirmDelete } from "@/app/utils/sweetAlert";
import {
  createBuy,
  DeleteBuy,
  listProduct,
  updateBuy,
} from "@/app/services/buyService";
import { validateCreateBuy } from "@/app/utils/validation";
import { extractErrorMessage } from "@/app/utils/errorHandler";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serial, setSerial] = useState("");
  const [name, setName] = useState("");
  const [release, setRelease] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [remark, setRemark] = useState("");

  const [products, setProducts] = useState<any[]>([]); // สินค้าที่ซื้อ
  const [id, setId] = useState<string | null>(null); // id เอาไว้ Update รายการ
  const [qty, setQty] = useState(1);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await listProduct(page);
      setProducts(response.data);
      setTotalRows(response.pagination.totalItems);
      setTotalPage(response.pagination.totalPages);
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSave = async () => {
    const errorValidate = validateCreateBuy(
      serial,
      name,
      release,
      color,
      price,
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
          price,
          customerName,
          customerPhone,
          customerAddress,
          remark,
          qty
        );
      } else {
        response = await updateBuy(
          id,
          serial,
          name,
          release,
          color,
          price,
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
          type="text"
          placeholder="ระบุราคา"
          maxLength={50}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
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
          placeholder="ระบบจำนวน"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />

        <div className="mt-2 block">
          <button className="btn" onClick={handleSave} disabled={isLoading}>
            <i className="fa-solid fa-save mr-2"></i>
            {isLoading ? "กำลังบันทึก" : "บันทึก"}
          </button>
        </div>
      </Modal>

      <table className="table mt-3">
        <thead>
          <tr>
            <th className="text-left">serial</th>
            <th className="text-left">ชื่อสินค้า</th>
            <th className="text-left">รุ่น</th>
            <th className="text-left">สี</th>
            <th className="text-right pr-0">ราคา</th>
            <th className="text-left">ลูกค้า</th>
            <th className="text-left">เบอร์โทรศัพท์</th>
            <th className="text-left">หมายเหตุ</th>
            <th className="w-[120px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item: any) => (
            <tr key={item.id}>
              <td>{item.serial}</td>
              <td>{item.name}</td>
              <td>{item.release}</td>
              <td>{item.color}</td>
              <td className="text-right">{item.price.toLocaleString()}</td>
              <td>{item.customerName}</td>
              <td>{item.customerPhone}</td>
              <td>{item.remark || "-"}</td>
              <td>
                <button
                  onClick={() => handleUpdate(item.id)}
                  className="btn-edit mr-2"
                >
                  <i className="fa-solid fa-edit"></i>
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="btn-delete"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5">
        <div>รายการทั้งหมด {totalRows} รายการ</div>
        <div>
          หน้า {page} จาก {totalPage} รายการ
        </div>
        <div className="flex gap-1">
          <button className="btn" onClick={() => setPage(1)}>
            <i className="fa-solid fa-caret-left-mr-2"></i>
            หน้าแรก
          </button>
          <button className="btn" onClick={() => setPage(page - 1)}>
            <i className="fa-solid fa-caret-left"></i>
          </button>
          {Array.from({ length: totalPage }, (_, i) => (
            <button
              className={`btn ${i + 1 === page ? "btn-active" : ""}`}
              onClick={() => setPage(i + 1)}
              key={i}
            >
              {i + 1}
            </button>
          ))}

          <button className="btn" onClick={() => setPage(page + 1)}>
            <i className="fa-solid fa-caret-right"></i>
          </button>
          <button className="btn" onClick={() => setPage(totalPage)}>
            หน้าสุดท้าย
            <i className="fa-solid fa-caret-right ml-2"></i>
          </button>
        </div>
      </div>
    </>
  );
}
