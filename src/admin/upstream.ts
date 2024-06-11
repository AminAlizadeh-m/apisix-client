import {
  CreateUpstreamResponse,
  GetUpstreamResponse,
  UpdateUpstreamResponse,
  UpstreamDef,
} from '../../types/admin/upstream';
import { PaginationResponse } from '../../types/client';
import ApisixAdminClient from '../client';

export default class UpstreamService {
  private readonly client: ApisixAdminClient;
  constructor(client: ApisixAdminClient) {
    this.client = client;
  }

  /**
   * Fetches specified Upstream by id.
   * @param id unique id of upstream
   * @returns {GetUpstreamResponse}
   */
  get = async (id: string): Promise<GetUpstreamResponse> => {
    const res = await this.client.request<GetUpstreamResponse>('get', `/apisix/admin/upstreams/${id}`);
    return res.data;
  };

  /**
   * Fetch a list of all configured Upstreams.
   * @param id unique id of upstream
   * @param desc description of upstream
   * @param name name of upstream
   * @param page offset
   * @param page_size limit
   * @returns {PaginationResponse<GetUpstreamResponse>}
   */
  getList = async (
    id?: string,
    desc?: string,
    name?: string,
    page?: string,
    page_size?: string,
  ): Promise<PaginationResponse<GetUpstreamResponse>> => {
    const res = await this.client.request<PaginationResponse<GetUpstreamResponse>>(
      'get',
      `/apisix/admin/upstreams`,
      undefined,
      {
        id,
        desc,
        name,
        page,
        page_size,
      },
    );

    return res.data;
  };

  /**
   * Creates an Upstream and assigns a random id.
   * @param config {UpstreamDef}
   * @returns {CreateUpstreamResponse}
   */
  create = async (config: UpstreamDef): Promise<CreateUpstreamResponse> => {
    const data = config;
    const res = await this.client.request<CreateUpstreamResponse>('post', '/apisix/admin/upstreams', data);

    return res.data;
  };

  /**
   * Creates an Upstream with the specified id.
   * @param id unique id of upstream
   * @param config {UpstreamDef}
   * @returns {CreateUpstreamResponse}
   */
  upsert = async (id: string, config: UpstreamDef): Promise<CreateUpstreamResponse> => {
    const data = { id, ...config };
    const res = await this.client.request<CreateUpstreamResponse>('put', '/apisix/admin/upstreams', data);

    return res.data;
  };

  /**
   * Updates the selected attributes of the specified, existing Upstream. To delete an attribute, set value of attribute set to null.
   * @param id unique id of upstream
   * @param config {UpstreamDef}
   * @returns {UpdateUpstreamResponse}
   */
  update = async (id: string, config: UpstreamDef): Promise<UpdateUpstreamResponse> => {
    const res = await this.client.request<UpdateUpstreamResponse>('put', `/apisix/admin/upstreams/${id}`, config);

    return res.data;
  };

  /**
   * Updates the attribute specified in the path. The values of other attributes remain unchanged.
   * @param id
   * @param path
   * @param config
   * @returns
   */
  updateByPath = async (id: string, path: string, config: UpstreamDef) => {
    const res = await this.client.request<UpdateUpstreamResponse>(
      'put',
      `/apisix/admin/upstreams/${id}/${path}`,
      config,
    );

    return res.data;
  };

  /**
   * Removes the Upstream with the specified id.
   * @param id unique id of upstream
   * @returns {void}
   */
  delete = async (id: string): Promise<void> => {
    await this.client.request<null>('delete', `/apisix/admin/upstreams/${id}`);
  };
}
