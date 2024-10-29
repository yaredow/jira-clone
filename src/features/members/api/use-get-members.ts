import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type useGetMembersProps = {
  workspaceId: string;
};

export const useGetMembers = ({ workspaceId }: useGetMembersProps) => {
  const { data: members, isLoading } = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.data;
    },
  });
  return { members, isLoading };
};
