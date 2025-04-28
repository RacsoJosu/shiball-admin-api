type PaginationParam = {
  limit?: number;
  page?: number;
  skip?: number;
};
export function pagination(params: PaginationParam) {
  const limit = Number(params.limit ?? 10);
  const page = Number(params.page ?? 1);
  const skip = (page - 1) * limit;

  return { limit, page, skip };
}
