"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateWorkspaceData, UpdateWorkspaceSchema } from "../schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useToast } from "@/hooks/use-toast";
import { useResetInviteCode } from "../api/use-reset-invite-code";

type CreateWorkspaceFormProps = {
  onCancel?: () => void;
  initialValues: Workspace;
};

export default function UpdateWorkspaceForm({
  onCancel,
  initialValues,
}: CreateWorkspaceFormProps) {
  const { isPending, updateWorksapce } = useUpdateWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { deleteWorkspace, isPending: isDeleteWorkspacePending } =
    useDeleteWorkspace();
  const { resetInviteCode, isPending: isResetInviteCodePending } =
    useResetInviteCode();

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Delete workspace",
    message: "Are you sure you want to delete this workspace?",
    variant: "destructive",
  });

  const [ResetDialog, confirmReset] = useConfirm({
    title: "Reset invite code",
    message: "This will invalidate the current invite code",
    variant: "destructive",
  });

  const form = useForm<UpdateWorkspaceData>({
    resolver: zodResolver(UpdateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl || undefined,
    },
  });

  const onSubmit = (data: UpdateWorkspaceData) => {
    const finalValue = {
      ...data,
      image: data.image instanceof File ? data.image : "",
    };
    updateWorksapce(
      {
        form: finalValue,
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.$id}`);
        },
      },
    );
  };

  const handleConfirm = async () => {
    const ok = await confirm();

    if (ok) {
      deleteWorkspace(
        {
          param: {
            workspaceId: initialValues.$id,
          },
        },
        {
          onSuccess: () => {
            window.location.href = "/";
          },
        },
      );
    }
  };

  const handleRestInviteCode = async () => {
    const ok = await confirmReset();

    if (ok) {
      resetInviteCode(
        {
          param: {
            workspaceId: initialValues.$id,
          },
        },
        {
          onSuccess: () => {
            router.refresh();
          },
        },
      );
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => {
      toast({
        description: "Invite link copied to your clipboard",
      });
    });
  };

  return (
    <div className="flex flex-col gap-y-4">
      <ConfirmationDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center space-x-4 space-y-0  p-7">
          <Button
            className="flex gap-2 items-center justify-center"
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            Create a new workspace
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter name of the workspace"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="Logo"
                              className="object-cover"
                              fill
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Workspace Icon</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, SVG or JPEG up to 1MB
                          </p>
                          <input
                            type="file"
                            ref={inputRef}
                            className="hidden"
                            accept=".jpg, .png, .jpeg, .svg"
                            disabled={isPending}
                            onChange={handleImageChange}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="destructive"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => {
                                inputRef.current?.click();
                              }}
                            >
                              Upload Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="teritery"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />

                <div className="py-7">
                  <DottedSeparator />
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    type="reset"
                    variant="secondary"
                    disabled={false}
                    onClick={onCancel}
                    className={cn(!onCancel && "invisible")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    Save changes
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className=" font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite like to add members to your workspace
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-center gap-x-2">
                <Input disabled value={fullInviteLink} />
                <Button
                  className="size-12"
                  variant="secondary"
                  onClick={handleCopyInviteLink}
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              size="sm"
              className="mt-6 w-fit ml-auto"
              disabled={isPending || isResetInviteCodePending}
              onClick={handleRestInviteCode}
            >
              Reset invite code
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="text-destructive font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is an irreversable proccess and will remove
              associated data
            </p>
            <DottedSeparator className="py-7" />
            <Button
              variant="destructive"
              size="sm"
              className="mt-6 w-fit ml-auto"
              disabled={isPending || isDeleteWorkspacePending}
              onClick={handleConfirm}
            >
              Delete workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
