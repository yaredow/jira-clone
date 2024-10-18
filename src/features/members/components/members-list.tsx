"use client";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetMembers } from "../api/use-get-members";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Loader2, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import DottedSeparator from "@/components/dotted-separator";
import { Fragment } from "react";
import MemberAvatar from "./member-avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useDeleteMember } from "../api/use-delete-member";
import { useUpdateMember } from "../api/use-update-member";
import { MemberRole } from "../types";
import { useConfirm } from "@/hooks/use-confirm";

export default function MembersList() {
  const workspaceId = useWorkspaceId();
  const { members, isFetching } = useGetMembers({ workspaceId });
  const { deleteMember, isPending: isDeletingMember } = useDeleteMember();
  const { updateMember, isPending: isUpdatingMember } = useUpdateMember();
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Remove member",
    message: "This member will be removed from the workspace",
    variant: "destructive",
  });

  const handleDeletingMember = async (memberId: string) => {
    const ok = await confirm();
    console.log({ ok });

    if (!ok) {
      deleteMember(
        { param: { memberId } },
        {
          onSuccess: () => window.location.reload(),
        },
      );
    }
  };

  const handleUpdatingMember = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-7 p-7 space-y-0">
        <Button variant="secondary" size="sm" asChild>
          <Link
            href={`/workspaces/${workspaceId}`}
            className="flex items-center gap-x-2"
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members List</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {members?.data.documents.map((document, index) => (
          <Fragment key={index}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                name={document.name}
                className="size-10"
                fallbackClassName="text-lg"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{document.name}</p>
                <p className="text-xs text-muted-foreground">
                  {document.email}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" variant="secondary" size="icon">
                    <MoreVerticalIcon className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() =>
                      handleUpdatingMember(document.$id, MemberRole.ADMIN)
                    }
                    disabled={isUpdatingMember}
                  >
                    Set as administrator
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() =>
                      handleUpdatingMember(document.$id, MemberRole.MEMBER)
                    }
                    disabled={isUpdatingMember}
                  >
                    Set as member
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="font-medium text-amber-700"
                    onClick={() => handleDeletingMember(document.$id)}
                    disabled={isDeletingMember}
                  >
                    Remove {document.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < members.data.documents.length - 1 && (
              <Separator className="my-2.5 bg-neutral-200" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
