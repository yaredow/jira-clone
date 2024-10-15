import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.auth.login)["$post"]>;

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: login, isPending } = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["auth/current"] });
      toast({
        description: "Logged in",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        description: "Login failed",
        variant: "destructive",
      });
    },
  });
  return { login, isPending };
};
