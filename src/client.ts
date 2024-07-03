import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import { ConnectionConfig, EtcdConnectionConfig } from '../types/client';
import Upstream from './admin/upstream';
import Route from './admin/route';
import Plugin from './admin/plugin';
import Validation from './admin/validation';
import { stringify } from 'qs';
import { Etcd3 } from 'etcd3';

export default class ApisixAdminClient {
  private connectionConfig: ConnectionConfig;
  private etcdConnectionConfig: EtcdConnectionConfig;
  private readonly client: AxiosInstance;
  public readonly etcd: Etcd3;

  public upstream: Upstream;
  public route: Route;
  public plugin: Plugin;
  public validation: Validation;

  constructor(connectionConfig: ConnectionConfig, etcdConnectionConfig: EtcdConnectionConfig) {
    this.connectionConfig = connectionConfig;
    this.etcdConnectionConfig = etcdConnectionConfig;
    this.client = axios.create(this.connectionConfig);
    this.etcd = new Etcd3(this.etcdConnectionConfig);

    this.upstream = new Upstream(this);
    this.route = new Route(this);
    this.plugin = new Plugin(this);
    this.validation = new Validation(this);
  }

  request = async <Request, Response>(method: Method, url: string, requestBody?: Request, query?: Request) => {
    const config: AxiosRequestConfig = {
      method,
      url,
    };
    if (requestBody) {
      config.data = requestBody;
    }
    if (query) {
      config.params = query;
      config.paramsSerializer = (params) => stringify(params);
    }
    return await this.client.request<Response>(config);
  };
}
