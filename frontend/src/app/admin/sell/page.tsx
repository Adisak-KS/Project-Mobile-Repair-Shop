"use client";

export default function Page() {
  return (
    <div>
      <div className="content-header">ขายสินค้า</div>
      <div className="flex gap-2">
        <input type="text" className="form-control" placeholder="serial" />
        <button className="btn flex items-center">
          <i className="fa-solid fa-save mr-2"></i>
          Save
        </button>
      </div>
    </div>
  );
}
