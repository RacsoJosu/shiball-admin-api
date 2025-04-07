export interface IWrite<T, G> {
  create(element: G): Promise<T | null>
  update(id: string, element: Partial<G>): Promise<T | null>
  delete(id: string): Promise<T | null>
}

export interface IRead<T> {
  getAll({search, limit, page }: {search?:string, limit?:number, page?:number }): Promise<Partial<T>[]>
  getById(id: string): Promise<T | null>
  getByEmail(email: string): Promise<T | null>
}
