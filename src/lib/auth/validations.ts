import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Profile name must be at least 2 characters").max(30),
  avatarKey: z.string().regex(/^avatar-[1-6]$/, "Invalid avatar key").optional(),
  avatarUrl: z.string().url("Invalid URL").max(2048, "URL too long").refine(
    (url) => !url.startsWith("javascript:") && !url.startsWith("data:"),
    "Invalid URL protocol"
  ).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
