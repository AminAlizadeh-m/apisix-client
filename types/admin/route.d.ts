/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseInfo } from '../client';
import { UpstreamDef } from './upstream';

export interface RouteDef {
  uri?: string;
  uris?: string[];
  name: string;
  desc?: string;
  priority?: number;
  methods?: string[];
  host?: string;
  hosts?: string[];
  remote_addr?: string;
  remote_addrs?: string[];
  vars?: any[];
  filter_func?: string;
  script?: any;
  script_id?: any; // For debug and optimization(cache), currently same as Route's ID
  plugins?: { [key: string]: any };
  plugin_config_id?: string;
  upstream?: UpstreamDef;
  service_id?: string;
  upstream_id?: string;
  service_protocol?: string;
  labels?: { [key: string]: string };
  enable_websocket?: boolean;
  status: number;
}

export interface Route extends RouteDef, BaseInfo {}
