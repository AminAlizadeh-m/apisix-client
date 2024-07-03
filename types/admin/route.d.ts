/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseInfo, PaginationRequest } from '../client';
import { UpstreamDef } from './upstream';

export interface RouteDef {
  uri?: string;
  uris?: string[];
  name: string;
  desc?: string;
  priority?: number;
  methods?: ('GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE' | 'PURGE')[];
  host?: string;
  hosts?: string[];
  remote_addr?: string;
  remote_addrs?: string[];
  vars?: any[];
  filter_func?: string;
  script?: any;
  script_id?: any; // For debug and optimization(cache), currently same as Route's ID
  plugins?: Record<string, Record<string, any>>;
  plugin_config_id?: string;
  upstream?: UpstreamDef;
  service_id?: string;
  upstream_id?: string | number;
  service_protocol?: string;
  labels?: { [key: string]: string };
  enable_websocket?: boolean;
  status: 0 | 1;
}

export interface Route extends RouteDef, BaseInfo {}

export interface GetListRoute extends PaginationRequest<string> {
  name?: string;
  uri?: string;
  label?: string;
  status?: string;
  host?: string;
  id?: string;
  desc?: string;
}
