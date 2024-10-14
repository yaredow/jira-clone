import { getCurrent } from "@/features/auth/server/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return <div className=" space-x-4">This is a home page</div>;
}
