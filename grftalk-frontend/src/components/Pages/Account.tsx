"use client";

import { updateUser } from "@/src/lib/requests";
import { UpdateUserData, updateUserSchema } from "@/src/lib/schemas/userSchema";
import { useAuthStore } from "@/src/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Account = () => {
  const { user, setUser } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const form = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      password: "",
      confirm_password: "",
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setAvatar(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: UpdateUserData) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", avatar || "");

    setLoading(true);
    const response = await updateUser(formData);
    setLoading(false);

    if (response.error) {
      toast.error(response.error.message, { position: "top-center" });
      return;
    }

    const user = response.data.user;

    setUser(user);

    form.setValue("name", user.name);
    form.setValue("email", user.email);
    form.setValue("password", "");
    form.setValue("confirm_password", "");
    setAvatar(null);

    toast.success("Profile updated successfully1", { position: "top-center" });
  };

  return (
    <main className="h-app flex items-center justify-center overflow-auto px-6">
      <Card className="w-full sm:w-112.5">
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" pt-5 space-y-8"
          >
            <div className="space-y-6">
              {loading ? (
                Array.from({ length: 7 }, (_, key) => (
                  <Skeleton key={key} className="h-10 rounded-md" />
                ))
              ) : (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="avatar">Avatar</Label>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-11">
                        <AvatarImage
                          src={avatarUrl ?? user?.avatar}
                          alt={user?.name}
                        />
                        <AvatarFallback>
                          {user?.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <Input
                        id="avatar"
                        type="file"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>
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

                  <Controller
                    name="confirm_password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">
                          Confirm password
                        </FieldLabel>
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

            <Button className="w-full" disabled={loading}>
              Update
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};
export default Account;
