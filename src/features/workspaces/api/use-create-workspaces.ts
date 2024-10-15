import { InferRequestType, InferResponseType } from "hono";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type ResponseType = InferResponseType<(typeof client.api.workspaces)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.workspaces)["$post"]>;

export const useCreateWorkspaces = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createWorkspace, isPending } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces.$post({ form });
      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast({
        description: "Workspace created successfully",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        description: "Error creating workspace",
        variant: "destructive",
      });
    },
  });
  return { createWorkspace, isPending };
};
