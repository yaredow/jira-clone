import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetWorkspaces = () => {
  const { data: workspaces, isFetching } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces.workspaces.$get();

      if (!response.ok) {
        return null;
      }

      return await response.json();
    },
  });
  return { workspaces, isFetching };
};
