import { InferRequestType, InferResponseType } from "hono";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type ResponseType = InferResponseType<(typeof client.api.tasks)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)["$post"]>;

export const useCreateTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createTask, isPending } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks.$post({ json });

      if (!response.ok) {
        throw new Error("Failed to create a task");
      }

      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        description: "Task created successfully",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        description: "Error creating task",
        variant: "destructive",
      });
    },
  });
  return { createTask, isPending };
};
