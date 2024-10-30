import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import DatePicker from "./date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { ListChecks, ListChecksIcon, UserIcon } from "lucide-react";
import { TaskStatus } from "@/features/tasks/types";
import { useTaskFilter } from "@/features/tasks/hooks/use-task-filter";

type DataFilersProps = {
  hideProjectFilter?: boolean;
};

export default function DataFilers({ hideProjectFilter }: DataFilersProps) {
  const workspaceId = useWorkspaceId();

  const { members, isLoading: isMemberLoading } = useGetMembers({
    workspaceId,
  });
  const { projects, isLoading: isProjectLoading } = useGetProjects({
    workspaceId,
  });

  const isLoading = isMemberLoading || isProjectLoading;

  const projectsOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.image,
  }));

  const membersOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const [{ projectId, status, assigneeId, dueDate, search }, setFilters] =
    useTaskFilter();

  const onStatusChange = (value: string) => {
    if (value === "all") {
      setFilters({ status: null });
    } else {
      setFilters({ status: value as TaskStatus });
    }
  };

  const onAssigneeChange = (value: string) => {
    if (value === "all") {
      setFilters({ status: null });
    } else {
      setFilters({ assigneeId: value as string });
    }
  };

  const onProjectChange = (value: string) => {
    if (value === "all") {
      setFilters({ status: null });
    } else {
      setFilters({ projectId: value as string });
    }
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status || undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={assigneeId || undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {membersOptions?.map((member) => (
            <SelectItem value={member.id} key={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={projectId || undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All projects" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          <SelectSeparator />
          {projectsOptions?.map((project) => (
            <SelectItem value={project.id} key={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
