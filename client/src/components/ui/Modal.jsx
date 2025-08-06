import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-card rounded-lg shadow-theme-lg w-full max-w-md mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-icon-primary hover:text-icon-accent"
        >
          ✖
        </button>
        {title && <h2 className="text-lg font-semibold text-primary mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
