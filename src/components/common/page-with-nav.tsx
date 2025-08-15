import React from "react";
import Navbar from "./navbar";

function PageWithNav({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div>{children}</div>
    </div>
  );
}

export default PageWithNav;
