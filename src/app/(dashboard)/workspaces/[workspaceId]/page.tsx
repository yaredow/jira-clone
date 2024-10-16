import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return <main>Workspace</main>;
}
