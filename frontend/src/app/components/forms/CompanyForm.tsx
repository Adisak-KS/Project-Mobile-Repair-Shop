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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 mb-6">
        <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          ข้อมูลร้าน
        </h1>
        <p className="text-sm text-gray-600">
          จัดการข้อมูลร้านค้าและรายละเอียดติดต่อ
        </p>
      </div>

      {/* Form Container */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
            {/* Company Icon */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
                <div className="relative bg-linear-to-br from-blue-500 to-indigo-600 rounded-full p-6 shadow-xl">
                  <i className="fa-solid fa-building text-white text-4xl"></i>
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
              <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-circle-info text-blue-600"></i>
                ข้อมูลพื้นฐาน
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    <i className="fa-solid fa-store text-indigo-600 mr-1.5"></i>
                    ชื่อร้าน
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="ระบุชื่อร้าน"
                    maxLength={50}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    <i className="fa-solid fa-location-dot text-indigo-600 mr-1.5"></i>
                    ที่อยู่
                  </label>
                  <textarea
                    id="address"
                    placeholder="ระบุที่อยู่"
                    maxLength={200}
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-200">
              <h3 className="text-sm font-bold text-purple-900 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-address-book text-purple-600"></i>
                ข้อมูลติดต่อ
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    <i className="fa-solid fa-phone text-purple-600 mr-1.5"></i>
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="ระบุเบอร์โทรศัพท์"
                    maxLength={50}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    <i className="fa-solid fa-envelope text-purple-600 mr-1.5"></i>
                    อีเมล
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="ระบุอีเมล"
                    maxLength={100}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Tax Information Section */}
            <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-lg p-5 border border-amber-200">
              <h3 className="text-sm font-bold text-amber-900 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-file-invoice text-amber-600"></i>
                ข้อมูลภาษี
              </h3>

              <div>
                <label htmlFor="taxCode" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  <i className="fa-solid fa-hashtag text-amber-600 mr-1.5"></i>
                  รหัสประจำตัวผู้เสียภาษี
                </label>
                <input
                  id="taxCode"
                  type="text"
                  placeholder="ระบุรหัสประจำตัวผู้เสียภาษี"
                  maxLength={50}
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t-2 border-gray-200">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className={`fa-solid ${isLoading ? 'fa-spinner fa-spin' : 'fa-save'} mr-2 text-sm`}></i>
                {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
