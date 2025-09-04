import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // 👈 import this

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ 
  isOpen, 
  onClose, 
  children,
  title = "Dialog",
  className = "max-w-lg"
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${className} max-h-[90vh] overflow-y-auto p-0 gap-0`}>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ModalWrapper;
