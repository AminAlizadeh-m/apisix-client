/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseInfo, PaginationRequest } from '../client';

export interface Node {
  host?: string;
  port?: number;
  weight: number;
  metadata?: any;
  priority?: number;
}

type TimeoutValue = number;
export interface Timeout {
  connect?: TimeoutValue;
  send?: TimeoutValue;
  read?: TimeoutValue;
}

export interface Healthy {
  interval?: number;
  http_statuses?: number[];
  successes?: number;
}

export interface UnHealthy {
  interval?: number;
  http_statuses?: number[];
  tcp_failures?: number;
  timeouts?: number;
  http_failures?: number;
}

type HealthCheckerType = 'http' | 'https' | 'tcp';

export interface Passive {
  type?: HealthCheckerType;
  healthy?: Healthy;
  unhealthy?: UnHealthy;
}

export interface Active {
  type?: HealthCheckerType;
  timeout?: number;
  concurrency?: number;
  host?: string;
  port?: number;
  http_path?: string;
  https_verify_certificate?: boolean;
  healthy?: Healthy;
  unhealthy?: UnHealthy;
  req_headers?: string[];
}

export interface HealthChecker {
  active?: Active;
  passive?: Passive;
}

export interface UpstreamTLS {
  client_cert?: string;
  client_key?: string;
  tls_verify?: boolean;
  verify?: boolean;
}

export interface UpstreamKeepalivePool {
  idle_timeout?: TimeoutValue;
  requests?: number;
  size: number;
}

export interface DiscovertArgs {
  group_name?: string;
  namespace_id?: string;
}

export type UpstreamType = 'roundrobin' | 'chash' | 'ewma' | 'least_conn';
export type UpstreamSchema = 'http' | 'https' | 'grpc' | 'grpcs' | 'tcp' | 'tls' | 'udp' | 'kafka';
export type UpstreamPassHost = 'node' | 'pass' | 'rewrite';
export type HashOnType = 'vars' | 'header' | 'cookie' | 'consumer' | 'vars_combinations';
export type Key =
  | 'remote_addr'
  | 'host'
  | 'uri'
  | 'server_name'
  | 'server_addr'
  | 'request_uri'
  | 'query_string'
  | 'remote_port'
  | 'hostname'
  | 'arg_id';

export interface UpstreamDef {
  type?: UpstreamType;
  nodes?: Node[];
  service_name?: string;
  discovery_type?: string;
  hash_on?: HashOnType;
  key?: Key;
  checks?: HealthChecker;
  retries?: number;
  retry_timeout?: TimeoutValue;
  timeout?: Timeout;
  name?: string;
  desc?: string;
  pass_host?: UpstreamPassHost;
  upstream_host?: string;
  scheme?: UpstreamSchema;
  labels?: { [key: string]: string };
  discovery_args?: DiscovertArgs;
  tls?: UpstreamTLS;
  keepalive_pool?: UpstreamKeepalivePool;
}

export interface UpstreamGetListRequest extends PaginationRequest<string> {
  id?: string;
  desc?: string;
  name?: string;
}

export interface Upstream extends UpstreamDef, BaseInfo {}
