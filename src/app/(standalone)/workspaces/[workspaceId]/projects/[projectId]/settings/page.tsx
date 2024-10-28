import { getCurrent } from "@/features/auth/queries";
import UpdateProjectForm from "@/features/projects/components/update-project-form";
import { getProject } from "@/features/projects/queries";
import { redirect } from "next/navigation";

type ProjectSettingsPageProps = {
  params: {
    projectId: string;
  };
};

export default async function ProjectSettingsPage({
  params,
}: ProjectSettingsPageProps) {
  const user = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  const initialValues = await getProject({
    projectId: params.projectId,
  });

  if (!initialValues) {
    throw new Error("Project not found");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateProjectForm initialValues={initialValues} />
    </div>
  );
}
