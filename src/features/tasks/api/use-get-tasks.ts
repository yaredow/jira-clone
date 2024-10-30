import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type UseGetTasksProps = {
  workspaceId: string;
};

export const useGetProjects = ({ workspaceId }: UseGetTasksProps) => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", workspaceId],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: { workspaceId },
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
