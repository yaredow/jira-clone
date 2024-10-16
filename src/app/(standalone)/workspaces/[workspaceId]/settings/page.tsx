import { getCurrent } from "@/features/auth/actions";
import { getWorkspace } from "@/features/workspaces/actions";
import UpdateWorkspaceForm from "@/features/workspaces/components/update-workspace-form";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { workspaceId: string };
}) {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  const initialValues = await getWorkspace({ workspaceId: params.workspaceId });

  if (!initialValues) redirect(`/workspaces/${params.workspaceId}`);

  return (
    <div>
      <UpdateWorkspaceForm initialValues={initialValues} />
    </div>
  );
}
