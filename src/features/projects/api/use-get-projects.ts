import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type UseGetProjectsProps = {
  workspaceId: string;
};

export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
  const { data: projects, isFetching } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    },
  });
  return { projects, isFetching };
};
