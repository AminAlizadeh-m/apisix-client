import { Upstream, UpstreamDef } from '../../types/admin/upstream';
import { CreateResponse, GetResponse, PaginationResponse } from '../../types/client';
import ApisixAdminClient from '../client';

export default class UpstreamService {
  private readonly client: ApisixAdminClient;
  constructor(client: ApisixAdminClient) {
    this.client = client;
  }

  /**
   * Fetches specified Upstream by id.
   * @param id unique id of upstream
   * @returns {GetResponse<Upstream>}
   */
  get = async (id: string): Promise<GetResponse<Upstream>> => {
    const res = await this.client.request<GetResponse<Upstream>>('get', `/apisix/admin/upstreams/${id}`);
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
  ): Promise<PaginationResponse<GetResponse<Upstream>>> => {
    const res = await this.client.request<PaginationResponse<GetResponse<Upstream>>>(
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
   * @returns {CreateResponse<Upstream>}
   */
  create = async (config: UpstreamDef): Promise<CreateResponse<Upstream>> => {
    const res = await this.client.request<CreateResponse<Upstream>>('post', '/apisix/admin/upstreams', config);

    return res.data;
  };

  /**
   * Creates an Upstream with the specified id.
   * @param id unique id of upstream
   * @param config {UpstreamDef}
   * @returns {CreateResponse<Upstream>}
   */
  upsert = async (id: string, config: UpstreamDef): Promise<CreateResponse<Upstream>> => {
    const res = await this.client.request<CreateResponse<Upstream>>('put', `/apisix/admin/upstreams/${id}`, config);

    return res.data;
  };

  /**
   * Updates the selected attributes of the specified, existing Upstream. To delete an attribute, set value of attribute set to null.
   * @param id unique id of upstream
   * @param config {UpstreamDef}
   * @returns {CreateResponse<Upstream>}
   */
  update = async (id: string, config: UpstreamDef): Promise<CreateResponse<Upstream>> => {
    const res = await this.client.request<CreateResponse<Upstream>>('patch', `/apisix/admin/upstreams/${id}`, config);

    return res.data;
  };

  /**
   * Updates the attribute specified in the path. The values of other attributes remain unchanged.
   * @param id unique id of upstream
   * @param path like node
   * @param config {UpstreamDef}
   * @returns {CreateResponse<Upstream>}
   */
  updateByPath = async (id: string, path: string, config: UpstreamDef): Promise<CreateResponse<Upstream>> => {
    const res = await this.client.request<CreateResponse<Upstream>>(
      'patch',
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

  /**
   * Return result of upstream exists checking by name and exclude id.
   * @param name
   * @param exclude
   * @returns
   */
  exists = async (name?: string, exclude?: string): Promise<boolean> => {
    const res = await this.client.request<boolean>('get', `/apisix/admin/notexist/upstreams`, undefined, {
      name,
      exclude,
    });
    return res.data;
  };
}
