import PageWithNav from "@/components/common/page-with-nav";
import { Button } from "@/components/ui/button";
import React from "react";
import Home from "./home/_components/home-page";

const page = () => {
  return (
    <>
      <PageWithNav>
        <Home />
      </PageWithNav>
    </>
  );
};

export default page;
