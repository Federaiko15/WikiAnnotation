import { z } from "zod";

export const userDataSchema = z.object({
  username: z.string().min(1).max(30),
  email: z.email(),
  password: z.string().min(8).max(25),
});
