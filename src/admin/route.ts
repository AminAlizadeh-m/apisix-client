import { Route, RouteDef } from '../../types/admin/route';
import { CreateResponse, GetResponse, PaginationResponse } from '../../types/client';
import ApisixAdminClient from '../client';

export default class RouteService {
  private readonly client: ApisixAdminClient;
  constructor(client: ApisixAdminClient) {
    this.client = client;
  }

  /**
   * Fetches specified Route by id.
   * @param id
   * @returns
   */
  get = async (id: string): Promise<GetResponse<Route>> => {
    const res = await this.client.request<GetResponse<Route>>('get', `/apisix/admin/routes/${id}`);
    return res.data;
  };

  /**
   * Fetches a list of all configured Routes.
   * @param name
   * @param uri
   * @param label
   * @param status
   * @param host
   * @param id
   * @param desc
   * @param page
   * @param page_size
   * @returns
   */
  getList = async (
    name?: string,
    uri?: string,
    label?: string,
    status?: string,
    host?: string,
    id?: string,
    desc?: string,
    page?: number,
    page_size?: number,
  ): Promise<PaginationResponse<GetResponse<Route>>> => {
    const res = await this.client.request<PaginationResponse<GetResponse<Route>>>(
      'get',
      `/apisix/admin/routes`,
      undefined,
      {
        name,
        uri,
        label,
        status,
        host,
        id,
        desc,
        page,
        page_size,
      },
    );
    return res.data;
  };

  /**
   * Creates a Route and assigns a random id.
   * @param config
   * @returns
   */
  create = async (config: RouteDef): Promise<CreateResponse<Route>> => {
    const res = await this.client.request<CreateResponse<Route>>('post', `/apisix/admin/routes`, config);
    return res.data;
  };

  /**
   * Creates a Route with the specified id.
   * @param id
   * @param config
   * @returns
   */
  upsert = async (id: string, config: RouteDef): Promise<CreateResponse<Route>> => {
    const res = await this.client.request<CreateResponse<Route>>('put', `/apisix/admin/routes/${id}`, config);
    return res.data;
  };

  /**
   * Updates the selected attributes of the specified, existing Route. To delete an attribute, set value of attribute set to null.
   * @param id
   * @param config
   * @returns
   */
  update = async (id: string, config: RouteDef): Promise<CreateResponse<Route>> => {
    const res = await this.client.request<CreateResponse<Route>>('patch', `/apisix/admin/routes/${id}`, config);
    return res.data;
  };

  /**
   * Updates the attribute specified in the path. The values of other attributes remain unchanged.
   * @param id
   * @param path
   * @param config
   * @returns
   */
  updateByPath = async (id: string, path: string, config: RouteDef): Promise<CreateResponse<Route>> => {
    const res = await this.client.request<CreateResponse<Route>>('patch', `/apisix/admin/routes/${id}/${path}`, config);
    return res.data;
  };

  /**
   * Removes the Route with the specified id.
   * @param id
   */
  delete = async (id: string): Promise<void> => {
    await this.client.request<void>('delete', `/apisix/admin/routes/${id}`);
  };
}
