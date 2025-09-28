"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "../components/ui/modal";
import { updateUser, userInfo } from "../services/userService";
import toast from "react-hot-toast";
import { extractErrorMessage } from "../utils/errorHandler";

export default function Sidebar() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [level, setLevel] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // กัน null
    const authHeader = {
      Authorization: `Bearer ${token}`,
    };

    const response = await userInfo(authHeader);

    setFirstName(response.data.firstName);
    setLastName(response.data.lastName);
    setUsername(response.data.username);
    setLevel(response.data.level);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleShowModal = () => {
    setIsShow(true);
  };

  const handleCloseModal = () => {
    setIsShow(false);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (password !== confirmPassword) {
        toast.error("รหัสผ่าน ไม่ตรงกัน");
        return;
      }

      const token = localStorage.getItem('token');
      const authHeader = { 'Authorization' : `Bearer ${token}`}
      const response = await updateUser(firstName, username, password, level, authHeader);
      if (response.success) {
        fetchData();
        toast.success(response.message);
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

  return (
    <>
      <div className="bg-blue-600 h-screen w-64">
        <div className="p-5 bg-blue-800 text-white">
          <h1 className="text-xl">Mobile Repair</h1>
          <hr />
          <div className="flex items-center gap-2 mt-3">
            <i className="fa fa-user"></i>
            <span className="w-full">
              {firstName + " " + lastName} : {level}
            </span>

            <button
              onClick={handleShowModal}
              className="bg-yellow-400 rounded-full px-2 py-1"
            >
              <i className="fa fa-pencil"></i>
            </button>
            <button
              onClick={handleSignOut}
              className="bg-red-500 rounded-full px-2 py-1"
            >
              <i className="fa fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
        <div className="p-5 text-white text-xl flex flex-col gap-2">
          <div className="hover:bg-blue-700">
            <Link href="/admin/dashboard">
              <i className="fa-solid fa-gauge mr-2 w-5 text-center"></i>
              Dashboard
            </Link>
          </div>
          <div>
            <Link href="/admin/buy">
              <i className="fa-solid fa-basket-shopping mr-2 w-5 text-center"></i>
              Buy
            </Link>
          </div>
          <div>
            <Link href="/admin/sell">
              <i className="fa-solid fa-dollar-sign mr-2 w-5 text-center"></i>
              Sell
            </Link>
          </div>
          <div>
            <Link href="/admin/repair">
              <i className="fa-solid fa-screwdriver-wrench mr-2 w-5 text-center"></i>
              Repair
            </Link>
          </div>
          <div>
            <Link href="/admin/company">
              <i className="fa-solid fa-building mr-2 w-5 text-center"></i>
              Company
            </Link>
          </div>

          <div>
            <Link href="/admin/user">
              <i className="fa-solid fa-user-group mr-2 w-5 text-center"></i>
              User
            </Link>
          </div>
        </div>
      </div>

      <Modal
        title="แก้ไขข้อมูลผู้ใช้งาน"
        isOpen={isShow}
        onClose={handleCloseModal}
      >
        <div>
          <label htmlFor="">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="form-control"
          />
          <label htmlFor="">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="form-control"
          />
          <label htmlFor="">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
          />
          <label htmlFor="">Password</label>
          <input
            type="text"
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
          <label htmlFor="">Confirm Password</label>
          <input
            type="text"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-control"
          />

          <div className="mt-3">
            <button onClick={handleSave} className="btn">
              <i className="fa fa-save mr-2"></i>
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
