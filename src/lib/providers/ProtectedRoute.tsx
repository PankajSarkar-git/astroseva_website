"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import FullScreenLoader from "@/components/full-screen-loader";

const PUBLIC_ROUTES = ["/login", "/register"];

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useSelector((state: RootState) => state.auth); // Change `auth` to your slice name
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // If route is not public and user is not logged in → redirect
    if (!PUBLIC_ROUTES.includes(pathname) && !token) {
      router.replace("/login");
    }
  }, [pathname, token, router]);

  // While checking auth → don't render page
  // if (!PUBLIC_ROUTES.includes(pathname) && !token) {
  //   return <FullScreenLoader />;
  // }

  return <>{children}</>;
}
