"use client";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  title,
  children,
  isOpen,
  onClose,
  size = "md",
}: ModalProps) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex justify-center items-center">
        {/* Backdrop with blur and dark overlay */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        ></div>

        {/* Modal content */}
        <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] mx-4 my-4 flex flex-col transform transition-all duration-300 scale-100 animate-in fade-in zoom-in`}>
          <div className="flex justify-between items-center font-bold bg-linear-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-xl shrink-0">
            <h2 className="text-lg">{title}</h2>
            <button
              className="text-white/80 hover:text-white hover:rotate-90 transition-all duration-300"
              onClick={onClose}
            >
              <i className="fa-solid fa-xmark hover:cursor-pointer text-xl"></i>
            </button>
          </div>
          <div className="p-6 overflow-y-auto">{children}</div>
        </div>
      </div>
    )
  );
}
