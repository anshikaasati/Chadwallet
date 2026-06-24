// components/ui/Modal/Modal.tsx
import React from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 rounded-lg bg-bg-surface border border-border">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary focus:outline-none"
            >
              &#x2715;
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}
export default Modal;
