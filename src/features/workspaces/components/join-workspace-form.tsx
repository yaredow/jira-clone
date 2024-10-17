import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type JoinWorkspaceFormProps = {
  initialValues: {
    name: string;
  };
};

export default function JoinWorkspaceForm({
  initialValues,
}: JoinWorkspaceFormProps) {
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
        <div className="flex flex-col lg:flex-row gap-4">
          <Button variant="secondary" className="">
            Cancel
          </Button>

          <Button className="">Join workspace</Button>
        </div>
      </CardContent>
    </Card>
  );
}
