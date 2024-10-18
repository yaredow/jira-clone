import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type useGetMembersProps = {
  workspaceId: string;
};

export const useGetMembers = ({ workspaceId }: useGetMembersProps) => {
  const { data: members, isFetching } = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    },
  });
  return { members, isFetching };
};
