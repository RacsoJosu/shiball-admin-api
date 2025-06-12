import z from 'zod';

export const searchPaginationParamsSchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const idUSerSchema = z.object({
  idUser: z.string(),
});
