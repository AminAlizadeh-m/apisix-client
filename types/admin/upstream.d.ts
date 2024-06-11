/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseInfo } from '../client';

export interface Node {
  host: string;
  port: number;
  weight: number;
  metadata: any;
  priority: number;
}

type TimeoutValue = number;
export interface Timeout {
  connect?: TimeoutValue;
  send?: TimeoutValue;
  read?: TimeoutValue;
}

export interface Healthy {
  interval: number;
  http_statuses: number[];
  successes: number;
}

export interface UnHealthy {
  interval: number;
  http_statuses: number[];
  tcp_failures: number;
  timeouts: number;
  http_failures: number;
}

export interface Passive {
  type: string;
  healthy: Healthy;
  unhealthy: UnHealthy;
}

export interface Active {
  type: string;
  timeout: Timeout;
  concurrency: number;
  host: string;
  port: number;
  http_path: string;
  https_verify_certificate: boolean;
  healthy: Healthy;
  unhealthy: UnHealthy;
  req_headers: string[];
}

export interface HealthChecker {
  active: Active;
  passive: Passive;
}

export interface UpstreamTLS {
  client_cert: string;
  client_key: string;
}

export interface UpstreamKeepalivePool {
  idle_timeout: TimeoutValue;
  requests: number;
  size: number;
}

export interface UpstreamDef {
  nodes: Node[];
  retries: number;
  timeout: Timeout;
  type: string;
  checks: HealthChecker;
  hash_on: string;
  key: string;
  scheme: string;
  discovery_type: string;
  discovery_args: { [key: string]: any };
  pass_host: string;
  upstream_host: string;
  name: string;
  desc: string;
  service_name: string;
  labels: { [key: string]: string };
  tls: UpstreamTLS;
  keepalive_pool: UpstreamKeepalivePool;
  retry_timeout: TimeoutValue;
}

export interface Upstream extends UpstreamDef, BaseInfo {}
