"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateWorkspaceData, CreateWorkspaceSchema } from "../schemas";
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

type CreateWorkspaceFormProps = {
  onCancel?: () => void;
};

export default function CreateWorkspaceForm({
  onCancel,
}: CreateWorkspaceFormProps) {
  const { isPending, createWorkspace } = useCreateWorkspaces();
  const form = useForm<CreateWorkspaceData>({
    resolver: zodResolver(CreateWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CreateWorkspaceData) => {
    createWorkspace({ json: data });
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new workspace
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7"></CardContent>
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
            <div className="py-7">
              <DottedSeparator />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="reset"
                variant="secondary"
                disabled={false}
                onClick={onCancel}
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
    </Card>
  );
}
