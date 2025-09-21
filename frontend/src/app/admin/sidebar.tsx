import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="bg-blue-600 h-screen w-64 ">
      <div className="p-5 bg-blue-800 text-white">
        <h1 className="text-xl">Mobile Repair</h1>
        <hr />
        <div className="flex items-center gap-3 mt-3">
          <i className="fa fa-user"></i>
          <span className="w-full">Adisak Khongsuk</span>

          <button className="bg-yellow-400 rounded-full px-2 py-1">
            <i className="fa fa-pencil"></i>
          </button>
          <button className="bg-red-500 rounded-full px-2 py-1">
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
  );
}
