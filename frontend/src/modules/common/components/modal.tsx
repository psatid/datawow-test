import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  header: ReactNode;
  footer: ReactNode;
}

export const Modal = ({ isOpen, header, footer }: ModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4 text-black">
        {header}
        <div className="mt-6">{footer}</div>
      </div>
    </div>,
    document.body
  );
};
