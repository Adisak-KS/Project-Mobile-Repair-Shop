"use client";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({
  title,
  children,
  isOpen,
  onClose,
}: ModalProps) {
  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg w-1/3 max-h-[85vh] flex flex-col">
          <div className="flex justify-between items-center font-bold bg-blue-600 text-white p-4 rounded-t-lg">
            <h2>{title}</h2>
            <button
              className="text-gray-300 hover:text-white"
              onClick={onClose}
            >
              <i className="fa-solid fa-xmark hover:cursor-pointer"></i>
            </button>
          </div>
          <div className="m-2 p-2 overflow-y-auto">{children}</div>
        </div>
      </div>
    )
  );
}
