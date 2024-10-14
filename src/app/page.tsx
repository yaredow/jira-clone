"use client";

import { useCurrent } from "@/features/auth/api/use-current";
import { useLogout } from "@/features/auth/api/use-logout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "react-day-picker";

export default function Home() {
  const { isPending, data } = useCurrent();
  const logout = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !data) {
      router.push("/sign-in");
    }
  }, [data, isPending, router]);
  return (
    <div className=" space-x-4">
      You are logged in if you see this
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
}
