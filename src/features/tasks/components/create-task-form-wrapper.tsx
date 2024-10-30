import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader2 } from "lucide-react";
import CreateTaskForm from "./create-task-form";

type CreateTaskFormWrapperProps = {
  onCancel: () => void;
};

export default function CreateTaskFormWrapper({
  onCancel,
}: CreateTaskFormWrapperProps) {
  const workspaceId = useWorkspaceId();
  const { projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectsOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const membersOptions = members?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
  }));

  const isLoading = isLoadingProjects || isLoadingMembers;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTaskForm
      memberOptions={membersOptions || []}
      projectOptions={projectsOptions || []}
      onCancel={onCancel}
    />
  );
}
