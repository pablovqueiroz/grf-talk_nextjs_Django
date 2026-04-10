import { z } from "zod";

// Update User
export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is mandatory" })
      .max(80, { message: "Name: Max 80 characters" }),
    email: z
      .string()
      .email({ message: "Invalid email" })
      .max(254, { message: "Email: Max 254 characters" }),
    password: z
      .string()
      .max(80, { message: "Max 80 characters." })
      .refine(
        (value) =>
          !value ||
          /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9\s]).+$/.test(value),
        {
          message:
            "The password must contain at least one letter, one number, and one special character.",
        },
      ),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_passaword"],
  });

export type UpdateUserData = z.infer<typeof updateUserSchema>;
