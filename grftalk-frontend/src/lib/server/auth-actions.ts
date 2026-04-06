"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { signIn, signUp } from "../requests";
import { SignInData, SignUpData } from "../schemas/authSchema";

export const handleSignIn = async (data: SignInData) => {
  const response = await signIn(data);

  if (response.data) {
    (await cookies()).set({
      name: process.env.NEXT_PUBLIC_AUTH_KEY as string,
      value: response.data.access_token,
      httpOnly: true,
      maxAge: 86400 * 7,
    });
  }

  return response;
};

export const handleSignUp = async (data: SignUpData) => {
  const response = await signUp(data);

  if (response.data) {
    (await cookies()).set({
      name: process.env.NEXT_PUBLIC_AUTH_KEY as string,
      value: response.data.access_token,
      httpOnly: true,
      maxAge: 86400 * 7,
    });
  }

  return response;
};

export const handleSignOut = async () => {
  (await cookies()).delete(process.env.NEXT_PUBLIC_AUTH_KEY as string);
  redirect("/auth/signin");
};
