import { z } from "zod";

// New chat
export const newChatSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

export type NewChatData = z.infer<typeof newChatSchema>;
