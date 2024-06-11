import { CreateAxiosDefaults } from 'axios';

export interface ConnectionConfig extends CreateAxiosDefaults {}
export type QueryObjectSchema = Record<string, string | undefined>;
export interface ServerResponse<ResponseType> {
  data: ResponseType;
}
export interface PaginationResponse<T> {
  list: T[];
  total: number;
}
