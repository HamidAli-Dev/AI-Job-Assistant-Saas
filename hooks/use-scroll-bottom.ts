import { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useScrollToBottom = (dependencies: any[]) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, dependencies);

  return messagesEndRef;
};

export default useScrollToBottom;
