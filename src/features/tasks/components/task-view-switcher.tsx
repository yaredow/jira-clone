"use client";

import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

export default function TaskViewSwitcher() {
  const { open } = useCreateTaskModal();

  return (
    <Tabs className="flex-1 w-full border rounded-lg">
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-4 lg:flex-row justify-between items-center">
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
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        Data filter
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value="table">Data table</TabsContent>
          <TabsContent value="kanban">Data kanban</TabsContent>
          <TabsContent value="calendar">Data calendar</TabsContent>
        </>
      </div>
    </Tabs>
  );
}
