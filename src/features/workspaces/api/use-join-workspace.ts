import { InferRequestType, InferResponseType } from "hono";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { toast } from "@/hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();
  const { mutate: joinWorkspace, isPending } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspaces[":workspaceId"][
        "join"
      ].$post({
        json,
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to join workspace");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast({
        description: "Joined workspace",
      });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: (error) => {
      console.error(error);
      toast({
        description: "Error joining workspace",
        variant: "destructive",
      });
    },
  });
  return { joinWorkspace, isPending };
};
