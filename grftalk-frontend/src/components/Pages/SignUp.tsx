"use client";

import { SignUpData, signUpSchema } from "@/src/lib/schemas/authSchema";
import { handleSignUp } from "@/src/lib/server/auth-actions";
import { useAuthStore } from "@/src/stores/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SignUp = () => {
  const [Loading, setLoading] = useState(false);

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

  return <div>SignUp</div>;
};
export default SignUp;
