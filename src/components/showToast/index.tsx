import React from "react";
import toast, { Toaster, ToastBar } from "react-hot-toast";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export const showToast = {
  success: (message: string, title?: string) => {
    toast.success(message, {
      duration: 4000,
      style: {},
      className: "toast-success",
      iconTheme: {
        primary: "#059669",
        secondary: "#ffffff",
      },
    });
  },

  error: (message: string, title?: string) => {
    toast.error(message, {
      duration: 4000,
      style: {},
      className: "toast-error",
      iconTheme: {
        primary: "#dc2626",
        secondary: "#ffffff",
      },
    });
  },

  warning: (message: string, title?: string) => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-warning-light rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-warning" />
          </div>
          <div className="flex-1">
            {title && (
              <div className="font-semibold text-neutral-900 text-sm">
                {title}
              </div>
            )}
            <div className="text-neutral-600 text-sm">{message}</div>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      ),
      {
        duration: 4000,
        className: "toast-warning",
      }
    );
  },

  info: (message: string, title?: string) => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-info-light rounded-lg flex items-center justify-center">
            <Info className="w-4 h-4 text-info" />
          </div>
          <div className="flex-1">
            {title && (
              <div className="font-semibold text-neutral-900 text-sm">
                {title}
              </div>
            )}
            <div className="text-neutral-600 text-sm">{message}</div>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      ),
      {
        duration: 4000,
        className: "toast-info",
      }
    );
  },
};

// Main Toast Component with Custom Styling
const Toast: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{
        top: 16,
        right: 16,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "16px",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow:
            "0 8px 32px -4px rgba(0, 0, 0, 0.12), 0 4px 16px -4px rgba(0, 0, 0, 0.08)",
          maxWidth: "400px",
        },
        className: "toast-base",
        success: {
          style: {
            background:
              "linear-gradient(to right, rgba(209, 250, 229, 0.9), rgba(255, 255, 255, 0.9))",
            border: "1px solid rgba(5, 150, 105, 0.2)",
            color: "#059669",
          },
          iconTheme: {
            primary: "#059669",
            secondary: "#ffffff",
          },
        },
        error: {
          style: {
            background:
              "linear-gradient(to right, rgba(254, 226, 226, 0.9), rgba(255, 255, 255, 0.9))",
            border: "1px solid rgba(220, 38, 38, 0.2)",
            color: "#dc2626",
          },
          iconTheme: {
            primary: "#dc2626",
            secondary: "#ffffff",
          },
        },
      }}
    >
      {(t) => (
        <ToastBar
          toast={t}
          style={{
            ...t.style,
            animation: t.visible
              ? "toast-enter 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              : "toast-exit 0.2s ease-in forwards",
          }}
        >
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== "loading" && (
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="ml-2 p-1 rounded-lg hover:bg-black/5 transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export default Toast;
