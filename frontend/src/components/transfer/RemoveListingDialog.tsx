import React from "react";
import { ConfirmDialog } from "../ui/dialog";
import { formatCurrency } from "../../utils";

interface RemoveListingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  player: {
    name: string;
    position: string;
  } | null;
  isLoading?: boolean;
}

export const RemoveListingDialog: React.FC<RemoveListingDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  player,
  isLoading = false,
}) => {
  if (!player) return null;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Remove Transfer Listing"
      confirmText="Remove Listing"
      confirmVariant="destructive"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to remove{" "}
          <span className="font-medium">{player.name}</span> ({player.position})
          from the transfer market?
        </p>
      </div>
    </ConfirmDialog>
  );
};
