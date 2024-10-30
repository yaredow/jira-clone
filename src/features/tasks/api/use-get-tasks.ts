import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { Search } from "lucide-react";

type UseGetTasksProps = {
  workspaceId: string;
  projectId?: string | null;
  status?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
};

export const useGetTasks = ({
  workspaceId,
  dueDate,
  projectId,
  assigneeId,
  status,
  search,
}: UseGetTasksProps) => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      dueDate,
      projectId,
      assigneeId,
      status,
      search,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ? projectId : undefined,
          dueDate: dueDate ? dueDate : undefined,
          assigneeId: assigneeId ? assigneeId : undefined,
          status: status ? status : undefined,
          search: search ? search : undefined,
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.data;
    },
  });
  return { tasks, isLoading };
};
