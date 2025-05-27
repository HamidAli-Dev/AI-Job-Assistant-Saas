import React from "react";

interface ChatComponentProps {
  jobId: string;
  userId: string | null;
  userName: string | null;
}

const ChatComponent = ({ jobId, userId, userName }: ChatComponentProps) => {
  return <div>ChatComponent</div>;
};

export default ChatComponent;
