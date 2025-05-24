import React from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./_components/dashboard-sidebar";
import { cookies } from "next/headers";

const DashboardLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <>
      <SidebarProvider
        defaultOpen={defaultOpen}
        style={
          {
            "--sidebar-width": "280px",
          } as React.CSSProperties
        }
      >
        <DashboardSidebar />
        <main className="flex-1 w-full">{children}</main>
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;
