import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className=" space-x-4">
      <Button variant="default">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="muted">Link</Button>
      <Button variant="teritery">Teritery</Button>
    </div>
  );
}
