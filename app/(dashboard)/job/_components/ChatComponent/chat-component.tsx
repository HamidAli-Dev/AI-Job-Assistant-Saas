import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";

interface ChatComponentProps {
  jobId: string;
  userId: string | null;
  userName: string | null;
}

const ChatComponent = ({ jobId, userId, userName }: ChatComponentProps) => {
  const data = useQuery(
    api.jobInsightConversation.getMessagesByJobId,
    jobId ? { id: jobId } : "skip"
  );

  return (
    <div className="relative h-full bg-white flex divide-y divide-gray-200 flex-col justify-between gap-2">
      <div className="flex flex-1 justify-center gap-2">
        <ChatMessages userName={userName} data={data} />
      </div>

      <ChatInput
        jobId={jobId}
        userId={userId}
        isDisabled={data === undefined}
      />
    </div>
  );
};

export default ChatComponent;
