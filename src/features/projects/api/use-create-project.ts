import { InferRequestType, InferResponseType } from "hono";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type ResponseType = InferResponseType<
  (typeof client.api.projects)["$post"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>;

export const useCreateProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createProject, isPending } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects.$post({ form });

      if (!response.ok) {
        throw new Error("Failed to create a project");
      }

      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast({
        description: "Project created successfully",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        description: "Error creating project",
        variant: "destructive",
      });
    },
  });
  return { createProject, isPending };
};
