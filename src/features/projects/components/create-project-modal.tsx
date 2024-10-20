"use client";

import ResponsiveModal from "@/components/responsive-modal";
import { type ReactElement } from "react";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";
import CreateProjectForm from "./create-project-form";

export default function CreateProjectModal(): ReactElement {
  const { isOpen, setIsOpen, close } = useCreateProjectModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
}
