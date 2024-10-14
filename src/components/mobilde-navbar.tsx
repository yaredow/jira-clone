import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";

export default function MobileNavbar() {
  return (
    <Sheet modal={false}>
      <SheetTrigger>
        <Button asChild variant="secondary" className="lg:hidden ">
          <MenuIcon />
        </Button>
      </SheetTrigger>
    </Sheet>
  );
}
