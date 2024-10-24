import { getCurrent } from "@/features/auth/queries";
import CreateWorkspaceForm from "@/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";

export default async function CreateWorkspacePage() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return (
    <main className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </main>
  );
}
