"use client";

import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Loader2, PlusIcon } from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetTasks } from "../api/use-get-tasks";
import { useQueryState } from "nuqs";
import DataFilers from "@/components/data-filters";
import { useTaskFilter } from "../hooks/use-task-filter";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function TaskViewSwitcher() {
  const workspaceId = useWorkspaceId();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const [{ projectId, status, assigneeId, dueDate, search }] = useTaskFilter();

  const { tasks, isLoading: isTaskLoading } = useGetTasks({
    workspaceId,
    status,
    dueDate,
    projectId,
    assigneeId,
    search,
  });

  const { open } = useCreateTaskModal();

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="w-full flex-1 rounded-lg border"
    >
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-center justify-between gap-y-4 lg:flex-row">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="table" className="h-8 w-full lg:w-auto">
              Table
            </TabsTrigger>

            <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
              Kanban
            </TabsTrigger>

            <TabsTrigger value="calendar" className="h-8 w-full lg:w-auto">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button onClick={open} className="w-full lg:w-auto">
            <PlusIcon className="mr-2 size-4" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilers />
        <DottedSeparator className="my-4" />
        {isTaskLoading ? (
          <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table">
              <DataTable
                columns={columns}
                data={tasks?.documents ? tasks.documents : []}
              />
            </TabsContent>
            <TabsContent value="kanban">{JSON.stringify(tasks)}</TabsContent>
            <TabsContent value="calendar">{JSON.stringify(tasks)}</TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}
