import { InferRequestType, InferResponseType } from "hono";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { toast } from "@/hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$delete"],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$delete"]
>;

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteProject, isPending } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[":projectId"].$delete({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
      toast({
        description: "Project deleted successfully",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        description: "Error deleting project",
        variant: "destructive",
      });
    },
  });

  return { deleteProject, isPending };
};
