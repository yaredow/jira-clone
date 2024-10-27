import { Button } from "@/components/ui/button";
import { getCurrent } from "@/features/auth/queries";
import ProjectAvatar from "@/features/projects/components/workspace-avatar";
import { getProject } from "@/features/projects/queries";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
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

  if (!initialValues) {
    throw new Error("Project not found");
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={initialValues.name}
            image={initialValues.image}
            className="size-8"
          />
          <p className="text-lg font-bold">{initialValues.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}
            >
              <PencilIcon className="siz-4 mr-2" />
              Edit project
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
