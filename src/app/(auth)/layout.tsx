import { Button } from "@/components/ui/button";
import Image from "next/image";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className=" bg-neutral-100 min-h-screen">
      <div className=" mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Image src="/logo.svg" alt="logo" width={100} height={56} />
          <Button className="" variant="secondary">
            Sign Up
          </Button>
        </nav>
        <div className=" flex flex-col pt-4 items-center justify-center md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}
