/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateAxiosDefaults } from 'axios';
import { IOptions } from 'etcd3';

export interface ConnectionConfig extends CreateAxiosDefaults {}
export interface EtcdConnectionConfig extends IOptions {}
export type QueryObjectSchema = Record<string, string | number | undefined>;
export interface ServerResponse<ResponseType> {
  data: ResponseType;
}

export interface BaseInfo {
  id: any;
  create_time: string;
  update_time: string;
}
export interface PaginationResponse<T> {
  list: T[];
  total: number;
}

export interface GetResponse<T> {
  modifiedIndex: number;
  value: T;
  key: string;
  createdIndex: number;
}
export interface CreateResponse<T> {
  value: T;
  key: string;
}

export interface PaginationRequest<T> {
  page?: T;
  page_size?: T;
}
