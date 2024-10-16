import { Loader2 } from "lucide-react";
import { type ReactElement } from "react";

export default function Loader(): ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
