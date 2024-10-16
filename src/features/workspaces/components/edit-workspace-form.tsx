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
import { useCreateWorkspaces } from "../api/use-create-workspaces";
import { ChangeEvent, useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";

type CreateWorkspaceFormProps = {
  onCancel?: () => void;
  initialValues: Workspace;
};

export default function EditWorkspaceForm({
  onCancel,
  initialValues,
}: CreateWorkspaceFormProps) {
  const { isPending, updateWorksapce } = useUpdateWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex  p-7">
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
                  Create workspace
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
