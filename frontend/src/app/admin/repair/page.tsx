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
import { showAlertConfirmDelete } from "@/app/utils/sweetAlert";

export default function Page() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [remark, setRemark] = useState("");
  const [id, setId] = useState("");
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

        handleOpenModal();
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handelDelete = async (id: number) => {
    try {
      const isConfirmed = await showAlertConfirmDelete();

      if (!isConfirmed) {
        return;
      }

      const response = await removeService(id);
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

  const handleClearForm = () => {
    setId("");
    setName("");
    setPrice(0);
    setRemark("");
  };
  const handleOpenModal = () => {
    setIsShowModal(true);
  };

  const handleCloseModal = () => {
    setIsShowModal(false);
  };

  return (
    <>
      <h1 className="content-header">งานบริการ</h1>
      <div>
        <button onClick={handleOpenModal} className="btn">
          <i className="fa-solid fa-plus mr-2"></i>
          บันทึกงานบริการ
        </button>
      </div>

      <table className="table mt-5">
        <thead>
          <tr>
            <th className="text-left">ชื่องานบริการ</th>
            <th className="text-right">ราคา</th>
            <th className="text-left">หมายเหตุ</th>
            <th className="text-left">วันที่บันทึก</th>
            <th className="w-[120px]"></th>
          </tr>
        </thead>
        <tbody>
          {repairs.map((repair: any) => (
            <tr key={repair.id}>
              <td>{repair.name}</td>
              <td className="text-right">{repair.price.toLocaleString()}</td>
              <td>{repair.remark}</td>
              <td>{dayjs(repair.payDate).format("DD/MM/YYYY")}</td>
              <td className="text-center">
                <button
                  onClick={() => handleUpdate(repair.id)}
                  className="btn-edit mr-1"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>

                <button
                  onClick={() => handelDelete(repair.id)}
                  className="btn-delete"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isShowModal}
        onClose={handleCloseModal}
        title="บันทึกงานบริการ"
      >
        <div>
          <label htmlFor="">ชื่องานบริการ</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="">ราคา</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <label htmlFor="">หมายเหตุ</label>
          <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />

          <div className="mt-4">
            <button className="btn" onClick={handleSave} disabled={isLoading}>
              <i className="fa-solid fa-save mr-2"></i>
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
