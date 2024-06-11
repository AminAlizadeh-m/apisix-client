import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import { ConnectionConfig, QueryObjectSchema } from '../types/client';
import Upstream from './admin/upstream';

export default class ApisixAdminClient {
  private connectionConfig: ConnectionConfig;
  private readonly client: AxiosInstance;

  public upstream: Upstream;

  constructor(connectionConfig: ConnectionConfig) {
    this.connectionConfig = connectionConfig;
    this.client = axios.create(this.connectionConfig);

    this.upstream = new Upstream(this);
  }

  request = async <Response>(method: Method, url: string, requestBody?: unknown, query?: QueryObjectSchema) => {
    const config: AxiosRequestConfig = {
      method,
      url,
    };
    if (requestBody) {
      config.data = requestBody;
    }
    if (query) {
      config.params = query;
    }
    return await this.client.request<Response>(config);
  };
}
