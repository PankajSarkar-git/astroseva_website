import { Button } from "@/components/ui/button";
import React from "react";
import Home from "./_components/home-page";
import PageWithNav from "@/components/common/page-with-nav";

const page = () => {
  return (
    <PageWithNav>
      <Home />
    </PageWithNav>
  );
};

export default page;
