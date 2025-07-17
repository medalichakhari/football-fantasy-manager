import React from "react";
import { ConfirmDialog } from "../ui/dialog";

interface BuyPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  player: {
    name: string;
    position: string;
  } | null;
  isLoading?: boolean;
}

export const BuyPlayerDialog: React.FC<BuyPlayerDialogProps> = ({
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
      title="Confirm Player Purchase"
      confirmText="Buy Player"
      confirmVariant="default"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to buy{" "}
          <span className="font-medium">{player.name}</span> ({player.position}
          )?
        </p>
      </div>
    </ConfirmDialog>
  );
};
