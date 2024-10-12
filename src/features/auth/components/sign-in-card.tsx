"use client";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { SigninData, SigninSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import Link from "next/link";
import { useLogin } from "../api/use-login";

export default function SignInCard() {
  const { mutate: login } = useLogin();
  const form = useForm<SigninData>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SigninData) => {
    login({ json: data });
  };

  return (
    <Card className=" w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className=" flex items-center justify-between p-7">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" disabled={false}>
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <CardContent className="px-7 flex flex-col gap-y-4">
          <Button
            className="w-full flex flex-row gap-2"
            disabled={false}
            variant="secondary"
          >
            <FcGoogle size={16} /> Login with Google
          </Button>

          <Button
            className="w-full flex flex-row gap-2"
            disabled={false}
            variant="secondary"
          >
            <FaGithub size={16} />
            Login with Google
          </Button>
        </CardContent>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="justify-center flex items-center">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up">
              <span className=" text-blue-700">&nbsp;Sign Up</span>
            </Link>
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
