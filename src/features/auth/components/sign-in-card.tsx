import DottedSeparator from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInCard() {
  return (
    <Card className=" w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className=" flex items-center justify-between p-7">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
      </CardHeader>
      <div>
        <DottedSeparator />
      </div>
    </Card>
  );
}
