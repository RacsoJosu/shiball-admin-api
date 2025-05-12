export interface IWrite<T, G, ID> {
  create(element: G): Promise<T | null>;
  update(id: ID, element: Partial<G>): Promise<T | null>;
  delete(id: ID): Promise<T | null>;
}

export interface IRead<T, ID> {
  getAll({
    search,
    limit,
    page,
  }: {
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<Partial<T>[]>;
  getById(id: ID): Promise<T | null>;
}
