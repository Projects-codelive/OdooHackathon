import { z } from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  phoneNumber: z.string().optional().nullable(),
  bio: z.string().max(200).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
});
