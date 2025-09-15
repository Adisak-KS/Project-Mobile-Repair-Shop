"use client";

interface CompanyFormProps {
  name: string;
  setName: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  taxCode: string;
  setTaxCode: (value: string) => void;
  isLoading: boolean;
  handleSave: () => void;
}

export default function CompanyForm({
  name,
  setName,
  address,
  setAddress,
  phone,
  setPhone,
  email,
  setEmail,
  taxCode,
  setTaxCode,
  isLoading,
  handleSave,
}: CompanyFormProps) {
  return (
    <div>
      <h1 className="content-header">ข้อมูลร้าน</h1>
      <div>
        <label className="mt-4 block" htmlFor="name">
          ชื่อร้าน
        </label>
        <input
          type="text"
          placeholder="ระบุชื่อร้าน"
          maxLength={50}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="mt-4 block" htmlFor="address">
          ที่อยู่
        </label>
        <input
          type="text"
          placeholder="ระบุที่อยู่"
          maxLength={200}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label className="mt-4 block" htmlFor="phone">
          เบอร์โทรศัพท์
        </label>
        <input
          type="text"
          placeholder="ระบุเบอร์โทรศัพท์"
          maxLength={50}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="mt-4 block" htmlFor="email">
          อีเมล
        </label>
        <input
          type="email"
          placeholder="ระบุอีเมล"
          maxLength={100}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="mt-4 block" htmlFor="taxCode">
          รหัสประจำตัวผู้เสียภาษี
        </label>
        <input
          type="text"
          placeholder="ระบุรหัสประจำตัวผู้เสียภาษี"
          maxLength={50}
          value={taxCode}
          onChange={(e) => setTaxCode(e.target.value)}
        />

        <button
          className="mt-4 block btn"
          onClick={handleSave}
          disabled={isLoading}
        >
          <i className="fa-solid fa-floppy-disk mr-2"></i>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
