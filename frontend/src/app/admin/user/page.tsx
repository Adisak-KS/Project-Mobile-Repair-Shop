"use client";
import Modal from "@/app/components/ui/modal";
import {
  createUser,
  listUser,
  removeUser,
  updateUser,
} from "@/app/services/userService";
import { extractErrorMessage } from "@/app/utils/errorHandler";
import { showAlertConfirmDelete } from "@/app/utils/sweetAlert";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [level, setLevel] = useState("User");
  const [levelList, setLevelList] = useState(["Admin", "User"]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await listUser();
      setUsers(response.data);
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleSave = async () => {
    if (confirmPassword != password) {
      toast.error("รหัสผ่านไม่ถูกต้อง");
      return;
    }

    try {
      if (!id) {
        const response = await createUser(
          firstName,
          lastName,
          username,
          password,
          confirmPassword,
          level
        );

        if (response.success) {
          toast.success(response.message);
          fetchData();
          handleCloseModal();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await updateUser(
          id,
          firstName,
          lastName,
          username,
          level,
        );

        if (response.success) {
          toast.success(response.message);
          fetchData();
          handleCloseModal();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const user = users.find((user: any) => user.id === id) as any;

      setId(user.id);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setUsername(user.username);

      setIsShowModal(true);
    } catch (error: unknown) {
      return toast.error(extractErrorMessage(error));
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const isConfirmed = await showAlertConfirmDelete();

      if (!isConfirmed) {
        return;
      }

      const response = await removeUser(id);

      if (response.success) {
        toast.success(response.message);
        fetchData();
      } else {
        toast.error(response.message);
      }

      return;
    } catch (error: unknown) {
      return toast.error(extractErrorMessage(error));
    }
  };

  const handleOpenModal = () => {
    setIsShowModal(true);
  };

  const handleCloseModal = () => {
    setIsShowModal(false);
  };

  return (
    <>
      <h1 className="content-header">ผู้ใช้งาน</h1>
      <div>
        <button className="btn" onClick={handleOpenModal}>
          <i className="fa-solid fa-plus mr-2"></i>
          เพิ่มผู้ใช้งาน
        </button>

        <table className="table mt-5">
          <thead>
            <tr>
              <th className="text-left">ชื่อ</th>
              <th className="text-left">นามสกุล</th>
              <th className="text-left">Username</th>
              <th className="text-left">Level</th>
              <th className="w-[120px]"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.username}</td>
                <td>{user.level}</td>
                <td className="text-center">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="btn-edit mr-1"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    onClick={() => handleRemove(user.id)}
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
          title={id ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน"}
        >
          <div>
            <label htmlFor="">ชือ</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="">นามสกุล</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {id === "" ? (
            <>
              <div className="mt-4">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          ) : null}
          <div className="mt-4">
            <label htmlFor="">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="form-control"
            >
              {levelList.map((item: any) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <button className="btn" onClick={handleSave} disabled={isLoading}>
              <i className="fa-solid fa-save mr-2"></i>
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}
