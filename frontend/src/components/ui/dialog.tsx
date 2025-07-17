import React, { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
          {footer && (
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  children?: ReactNode;
  confirmText?: string;
  confirmVariant?: "default" | "destructive";
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  children,
  confirmText = "Confirm",
  confirmVariant = "default",
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            loading={isLoading}
            disabled={isLoading}
            className={
              confirmVariant === "destructive"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }
          >
            {confirmText}
          </Button>
        </>
      }
    >
      {children || <p className="text-gray-600">{message}</p>}
    </Dialog>
  );
};
