"use client";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import ProjectAvatar from "@/features/projects/components/workspace-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

export default function Projects() {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateProjectModal();
  const projectId = null;
  const pathName = usePathname();
  const { projects } = useGetProjects({ workspaceId });
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          onClick={() => open()}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {projects?.data.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${projectId}`;
        const isActive = pathName === href;

        return (
          <Link href={href} key={project.$id}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary",
              )}
            >
              <ProjectAvatar
                name={project.name}
                image={project.image}
                fallbackClassName=""
              />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
