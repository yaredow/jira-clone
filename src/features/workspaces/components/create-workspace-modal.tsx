"use client";

import ResponsiveModal from "@/components/responsive-modal";
import { type ReactElement } from "react";
import CreateWorkspaceForm from "./create-workspace-form";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";

export default function CreateWorkspaceModal(): ReactElement {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
}
