"use client";

import { z } from "zod";

// Sign In
export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is mandatory" }),
});

export type SignInData = z.infer<typeof signInSchema>;

// Sign Up
export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is mandatory" })
    .max(80, { message: "Max 80 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email" })
    .max(254, { message: "Max 254 characters" }),
  password: z
    .string()
    .min(1, { message: "Password is mandatory" })
    .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9\s]).+$/, {
      message:
        "The password must contain at least one letter, one number, and one special character.",
    })
    .max(80, { message: "Max 80 characters" }),
});
