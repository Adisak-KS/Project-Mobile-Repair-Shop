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

  const box = (color: string, title: string, value: string) => {
    return (
      <div
        className={`flex flex-col gap-4 items-end w-full ${color} p-4 rounded-lg text-white`}
      >
        <div className="text-2xl font-bold">{title}</div>
        <div className="text-4xl font-bold">{value}</div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="content-header">Dashboard</h1>
      <div className="flex gap-4 me-3 items-center">
        <div className="w-[50px] text-right">เลือกปี</div>
        <select
          value={currentYear}
          onChange={(e) => setCurrentYear(parseInt(e.target.value))}
          className="form-control"
          style={{ width: "200px" }}
        >
          {listYear.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button className="btn flex items-center w-[161px]" onClick={()=>{
          fetchData(currentYear)
        }}>
          <i className="fa-solid fa-magnifying-glass mr-3"></i>
          แสดงรายการ
        </button>
      </div>
      <div className="flex gap-4">
        {box(
          "bg-purple-600",
          "ยอดขายทั้งหมด",
          (totalIncome ?? 0).toLocaleString() + " บาท"
        )}
        {box(
          "bg-orange-500",
          "งานรับซ่อม",
          totalRepair.toLocaleString() + " งาน"
        )}
        {box(
          "bg-blue-500",
          "รายการขาย",
          totalSale.toLocaleString() + " รายการ"
        )}
      </div>

      <div className="text-center mb-4 mt-5 text-xl font-bold">
        รายได้แต่ละเดือน
      </div>
      <div className="w-full" style={{ height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number) =>
                `รายได้ ${value.toLocaleString()} บาท`
              }
            />
            <Legend />
            <Bar dataKey="income" name="รายได้" fill="teal" opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
