"use client";
import React from "react";
import Link from "next/link";
import { MessageSquareTextIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface JobSidebarListProps {
  userId: string;
}

const JobSidebarList: React.FC<JobSidebarListProps> = ({ userId }) => {
  const pathname = usePathname();
  const jobs = [
    {
      id: "1",
      name: "Frontend Developer",
    },
  ];
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white/80 mt-0">
        Job List
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="min-h-[180px] max-h-[350px] scrollbar overflow-y-auto pb-2">
          {jobs.map((job) => {
            const jobPageUrl = `/job/${job.id}`;
            return (
              <SidebarMenuItem key={job.id}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "!bg-transparent !text-white hover:!bg-gray-700 transition-colors",
                    pathname === jobPageUrl && "!bg-gray-700"
                  )}
                >
                  <Link href={jobPageUrl} className="text-white">
                    <MessageSquareTextIcon className="w-4 h-4" />
                    <span>{job.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default JobSidebarList;
