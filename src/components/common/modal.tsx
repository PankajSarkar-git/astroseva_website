import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  parent?: string;
  header?: {
    title: string;
    description?: string;
  };
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  parent,
  header,
  footer,
  children,
  className = "",
  maxWidth = "md",
}) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent
        className={`
          ${maxWidthClasses[maxWidth]} 
          w-full 
          mx-4 
          rounded-2xl 
          border-0 
          shadow-2xl 
          bg-white 
          p-0 
          overflow-hidden
          ${className}
        `}
        // Remove default close button since we'll add our own
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        {/* Custom Header */}
        {header && (
          <DialogHeader className="relative px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold font-montserrat text-gray-900 mb-1">
                  {header.title}
                </DialogTitle>
                {header.description && (
                  <DialogDescription className="text-sm font-montserrat text-gray-600">
                    {header.description}
                  </DialogDescription>
                )}
              </div>

              {/* Custom Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="
                  absolute 
                  right-4 
                  top-4 
                  h-8 
                  w-8 
                  p-0 
                  rounded-full 
                  hover:bg-gray-100 
                  transition-colors
                "
              >
                <X className="h-4 w-4 text-gray-500" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </DialogHeader>
        )}

        {/* Content */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            {footer}
          </DialogFooter>
        )}

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
