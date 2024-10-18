"use client";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-inviteCode";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useRouter } from "next/navigation";

type JoinWorkspaceFormProps = {
  initialValues: {
    name: string;
  };
};

export default function JoinWorkspaceForm({
  initialValues,
}: JoinWorkspaceFormProps) {
  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();
  const router = useRouter();
  const { joinWorkspace, isPending } = useJoinWorkspace();

  const handleJoinWorkspace = () => {
    joinWorkspace(
      {
        param: { workspaceId },
        json: {
          code: inviteCode,
        },
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}`);
        },
      },
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You&apos;re invited to join <strong>{initialValues.name}</strong>.
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <Button
            variant="secondary"
            type="button"
            className="w-full lg:w-fit"
            size="lg"
            disabled={isPending}
            asChild
          >
            <Link href="/">Cancel</Link>
          </Button>

          <Button
            size="lg"
            className="w-full lg:w-fit"
            type="button"
            disabled={isPending}
            onClick={handleJoinWorkspace}
          >
            Join workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
