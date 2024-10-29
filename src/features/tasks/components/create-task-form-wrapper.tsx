import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

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

  return <div></div>;
}
