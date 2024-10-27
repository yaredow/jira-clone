import { getCurrent } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { redirect } from "next/navigation";

type ProjectIdPageProps = {
  params: {
    workspaceId: string;
    projectId: string;
  };
};

export default async function ProjectIdPage({ params }: ProjectIdPageProps) {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  const initialValues = await getProject({
    projectId: params.projectId,
  });

  return <div>{JSON.stringify(initialValues)}</div>;
}
