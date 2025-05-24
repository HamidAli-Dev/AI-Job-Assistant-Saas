"use client";
import { parseAsBoolean, useQueryState } from "nuqs";

const useSignInModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "signin",
    parseAsBoolean.withDefault(false)
  );

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return { isOpen, handleOpen, handleClose };
};

export default useSignInModal;
