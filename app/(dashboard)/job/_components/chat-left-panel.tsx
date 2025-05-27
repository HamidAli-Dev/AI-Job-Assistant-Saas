"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import ChatComponent from "./ChatComponent/chat-component";

const ChatLeftPanel = ({ jobId }: { jobId: string }) => {
  const { user } = useUser();
  const { isMobile, open } = useSidebar();

  const userId = user?.id || null;
  const userName = user?.username || null;

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="h-10 w-full border-b border-gray-200 pt-1 flex items-center px-2">
        <div className="flex items-center gap-2">
          {(!open || isMobile) && <SidebarTrigger />}
          <h1 className="font-semibold pt-1">Job Insight Mode</h1>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatComponent jobId={jobId} userId={userId} userName={userName} />
      </div>
    </div>
  );
};

export default ChatLeftPanel;
