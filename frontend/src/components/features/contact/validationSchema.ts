import { z } from "zod"

export const validationSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(3, "More than 3!!")
    .max(20, "Less than 20!!"),

  email: z
    .string()
    .nonempty("Email is required")
    .email("type correct Email address")
    .max(50, "Less than 50!!"),

  subject: z
    .string()
    .nonempty("Subject is required")
    .max(255, "Less than 255!!"),

  message: z
    .string()
    .nonempty("Message is required")
    .max(1000, "Less than 1000!!"),
  })