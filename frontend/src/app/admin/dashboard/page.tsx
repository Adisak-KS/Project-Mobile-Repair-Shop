"use client";
import { dashboardSell } from "@/app/services/sellService";
import { extractErrorMessage } from "@/app/utils/errorHandler";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalRepair, setTotalRepair] = useState(0);
  const [totalSale, setTotalSale] = useState(0);
  const [listYear, setListYear] = useState<any[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const prevYear = new Date().getFullYear() - 5;
    const years = Array.from({ length: 6 }, (_, index) => prevYear + index);
    setListYear(years);

    fetchData(currentYear);
  }, []);

  const fetchData = async (year?: number) => {
    const selectedYear = year ?? currentYear;
    try {
      const response = await dashboardSell(selectedYear);

      setTotalIncome(response.data.totalIncome);
      setTotalRepair(response.data.totalRepair);
      setTotalSale(response.data.totalSale);

      const chartData = response.data.incomePerMonth.map((item: any) => ({
        name: item.month,
        income: Number(item.income) || 0,
      }));
      console.log(chartData);
      setData(chartData);
    } catch (error: unknown) {
      return toast.error(extractErrorMessage(error));
    }
  };

  const box = (color: string, icon: string, title: string, value: string) => {
    return (
      <div
        className={`relative overflow-hidden w-full ${color} p-3 sm:p-5 rounded-lg sm:rounded-xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="text-xs font-semibold text-white/80 mb-1 sm:mb-2 uppercase tracking-wide">
              {title}
            </div>
            <div className="text-lg sm:text-2xl lg:text-3xl font-bold">
              {value}
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3">
            <i className={`${icon} text-xl sm:text-2xl lg:text-3xl`}></i>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="shrink-0 mb-3">
        <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-gray-600">
          ภาพรวมยอดขายและรายได้
        </p>
      </div>

      {/* Filter Section */}
      <div className="shrink-0 mb-3">
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-200">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <i className="fa-solid fa-calendar text-blue-600"></i>
              เลือกปี
            </label>
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(parseInt(e.target.value))}
              className="flex-1 sm:flex-none sm:w-48 px-4 py-2.5 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm bg-white font-semibold text-gray-700 shadow-sm hover:border-blue-400 hover:shadow-md cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[1.5em_1.5em] bg-position-[right_0.5rem_center] bg-no-repeat pr-10"
            >
              {listYear.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button
              className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
              onClick={() => fetchData(currentYear)}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
              <span>แสดงรายการ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-3">
        {box(
          "bg-linear-to-br from-purple-600 to-purple-700",
          "fa-solid fa-coins",
          "ยอดขายทั้งหมด",
          (totalIncome ?? 0).toLocaleString() + " บาท"
        )}
        {box(
          "bg-linear-to-br from-orange-500 to-orange-600",
          "fa-solid fa-screwdriver-wrench",
          "งานรับซ่อม",
          totalRepair.toLocaleString() + " งาน"
        )}
        {box(
          "bg-linear-to-br from-blue-500 to-blue-600",
          "fa-solid fa-shopping-cart",
          "รายการขาย",
          totalSale.toLocaleString() + " รายการ"
        )}
      </div>

      {/* Chart Section - เพิ่มพื้นที่ */}
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 flex flex-col">
        <div className="shrink-0 mb-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-0.5 flex items-center gap-2">
            <i className="fa-solid fa-chart-bar text-blue-600"></i>
            รายได้แต่ละเดือน
          </h2>
          <p className="text-xs text-gray-600">
            กราฟแสดงรายได้รายเดือนประจำปี {currentYear}
          </p>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickLine={{ stroke: "#d1d5db" }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickLine={{ stroke: "#d1d5db" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                }}
                formatter={(value: number) =>
                  [`${value.toLocaleString()} บาท`, "รายได้"]
                }
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "10px"
                }}
              />
              <Bar
                dataKey="income"
                name="รายได้"
                fill="url(#colorIncome)"
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
