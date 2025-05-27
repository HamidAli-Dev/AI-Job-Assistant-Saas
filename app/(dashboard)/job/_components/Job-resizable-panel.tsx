"use client";
import React from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSidebar } from "@/components/ui/sidebar";
import ChatLeftPanel from "./chat-left-panel";
import RightSidePanel from "./right-side-panel";

const JobResizablePanel = ({ jobId }: { jobId: string }) => {
  const { isMobile } = useSidebar();
  return (
    <ResizablePanelGroup
      className="w-full h-full"
      direction={isMobile ? "vertical" : "horizontal"}
    >
      <ResizablePanel defaultSize={isMobile ? 100 : 55}>
        {/* {Chat Ui} */}
        <ChatLeftPanel jobId={jobId} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={isMobile ? 25 : 45} className={"pt-2"}>
        {/* {Job Details} */}
        <RightSidePanel jobId={jobId} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default JobResizablePanel;
