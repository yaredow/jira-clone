import ResponsiveModal from "@/components/responsive-modal";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import CreateTaskForm from "./create-task-form";

export const CreateTaskModal = () => {
  const { isOpen, setIsOpen } = useCreateTaskModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskForm />
    </ResponsiveModal>
  );
};
