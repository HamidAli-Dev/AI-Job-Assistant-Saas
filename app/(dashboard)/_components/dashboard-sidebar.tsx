"use client";
import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import JobSidebarList from "./job-sidebar-list";
import SignInPrompt from "./signin-prompt";
import SidebarFooterContent from "./sidebar-footer-content";

const DashboardSidebar = () => {
  const userId = "123466";
  const isSignedIn = true;
  const isLoaded = true;
  return (
    <>
      <Sidebar className="px-2 !bg-[rgb(33,33,33)]">
        <SidebarHeader className="flex flex-row w-full items-center justify-between m-[4px_0px_0px]">
          <Link href="/" className="text-white text-xl">
            Job <b className="text-primary">Assistant</b>.ai
          </Link>
          <SidebarTrigger className="!text-white !p-0 !bg-gray-800" />
        </SidebarHeader>
        <SidebarContent className="overflow-hidden">
          <SidebarGroup>
            <SidebarGroupContent>
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full !bg-transparent !text-white border-[rgba(255,255,255,.2)] mt-3 !h-10 !rounded-l !font-medium text-sm hover:!bg-gray-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>New Job</span>
                </Button>
              </Link>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Job List */}
          {userId && <JobSidebarList userId={userId} />}

          {/* {Sign In Prompt} */}
          {isSignedIn && isLoaded ? <SignInPrompt /> : null}
        </SidebarContent>
        <SidebarFooter>
          <SidebarFooterContent
            isLoaded={isLoaded}
            isSignedIn={isSignedIn}
            userName={"Hamiid"}
            emailAddress={"abc@gmail.com"}
            userInitial={"H"}
            credits={10}
            loadingCredits={false}
            onUpgradeClick={() => {}}
            onSignOut={() => {}}
          />
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default DashboardSidebar;
