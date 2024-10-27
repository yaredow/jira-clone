import "server-only";

import { createSessionClient } from "@/lib/appwrite";

export const getCurrent = async () => {
  const { account } = await createSessionClient();
  return await account.get();
};
