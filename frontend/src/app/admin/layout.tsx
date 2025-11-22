import Sidebar from "./sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-5 bg-gray-200 overflow-hidden flex flex-col">
        <div className="bg-white p-5 rounded-lg shadow-lg shadow-gray-500 flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
