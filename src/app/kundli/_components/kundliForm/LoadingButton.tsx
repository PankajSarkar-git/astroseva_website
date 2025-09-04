import React from "react";
import { Button } from "@/components/ui/button";

interface LoadingButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
  loadingText = "Loading...",
  children,
  className = "",
  variant = "default",
  size = "default"
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={`transition-all duration-300 transform hover:scale-[1.02] ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;