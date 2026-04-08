"use client";

import { SignUpData, signUpSchema } from "@/src/lib/schemas/authSchema";
import { handleSignUp } from "@/src/lib/server/auth-actions";
import { useAuthStore } from "@/src/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpData) => {
    setLoading(true);
    const response = await handleSignUp(values);

    if (response.error) {
      setLoading(false);
      toast.error(response.error.message, { position: "top-center" });

      return;
    }

    setUser(response.data.user);
    toast.success("Authenticated successfully.", { position: "top-center" });

    // Redirect to home
    router.push("/");
  };

  return (
    <main className="h-app flex items-center justify-center overflow-auto px-6">
      <Card className="w-96">
        <CardTitle className="m-auto py-2 text-xl">Create a account</CardTitle>
        <CardDescription className="m-auto w-87.5 text-center">
          Insert your name, email and password to create a account.
        </CardDescription>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }, (_, key) => (
                  <Skeleton key={key} className="h-10 rounded-md" />
                ))
              ) : (
                <>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input
                          {...field}
                          id="name"
                          type="text"
                          placeholder="Your name..."
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          placeholder="johndoe@email.com"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                          {...field}
                          id="password"
                          type="password"
                          placeholder="********"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </>
              )}
            </div>

            <Button disabled={loading}>Register</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};
export default SignUpPage;
