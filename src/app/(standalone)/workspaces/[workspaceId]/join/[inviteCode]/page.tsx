import { getCurrent } from "@/features/auth/queries";
import JoinWorkspaceForm from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

type WorkspaceIdJoinPageProps = {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
};

export default async function WorkspaceIdJoinPage({
  params: { workspaceId },
}: WorkspaceIdJoinPageProps) {
  const user = getCurrent();

  if (!user) redirect("/sign-in");

  const initialValues = await getWorkspaceInfo({
    workspaceId,
  });

  if (!initialValues) redirect("/");

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        initialValues={initialValues}
        code={params.inviteCode}
        workspaceId={params.workspaceId}
      />
    </div>
  );
}
