import z from "zod";

export const seachParamsSchema = z.object({
    search: z.string().optional()
})