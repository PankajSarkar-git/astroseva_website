"use client";
import React from "react";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex items-center space-x-3">
        <span className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-4 h-4 rounded-full bg-primary animate-bounce"></span>
      </div>
    </div>
  );
};

export default FullScreenLoader;
