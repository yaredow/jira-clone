import { InferRequestType, InferResponseType } from "hono";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;

export const useUpdateWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: updateWorksapce, isPending } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[":workspaceId"].$patch({
        form,
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to update the workspaces");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
      toast({
        description: "Workspace updated successfully",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        description: "Error updating workspace",
        variant: "destructive",
      });
    },
  });
  return { updateWorksapce, isPending };
};
