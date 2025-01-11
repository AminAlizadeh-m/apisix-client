import { isAxiosError } from 'axios';
import { Upstream, UpstreamDef, UpstreamGetListRequest } from '../../types/admin/upstream';
import { CreateResponse, GetResponse, PaginationResponse } from '../../types/client';
import ApisixAdminClient from '../client';
import ValidationService from './validation';

export default class UpstreamService {
  private readonly client: ApisixAdminClient;
  private readonly validationService: ValidationService;
  constructor(client: ApisixAdminClient) {
    this.client = client;
    this.validationService = new ValidationService(client);
  }

  /**
   * Fetches specified Upstream by id.
   * @param id unique id of upstream
   * @returns {GetResponse<Upstream>}
   */
  get = async (id: string): Promise<GetResponse<Upstream>> => {
    const res = await this.client.request<null, GetResponse<Upstream>>('get', `/apisix/admin/upstreams/${id}`);
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
    const res = await this.client.request<UpstreamGetListRequest, PaginationResponse<GetResponse<Upstream>>>(
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
  create = async (def: UpstreamDef, validate = false): Promise<CreateResponse<Upstream>> => {
    if (validate) {
      await this.validationService.validate('upstreams', def);
    }
    const res = await this.client.request<UpstreamDef, CreateResponse<Upstream>>(
      'post',
      '/apisix/admin/upstreams',
      def,
    );

    return res.data;
  };

  /**
   * Creates an Upstream with the specified id.
   * @param id unique id of upstream
   * @param config {UpstreamDef}
   * @returns {CreateResponse<Upstream>}
   */
  upsert = async (id: string, config: UpstreamDef, validate = false): Promise<CreateResponse<Upstream>> => {
    if (validate) {
      await this.validationService.validate('upstreams', config);
    }
    const res = await this.client.request<UpstreamDef, CreateResponse<Upstream>>(
      'put',
      `/apisix/admin/upstreams/${id}`,
      config,
    );

    return res.data;
  };

  /**
   * Updates the selected attributes of the specified, existing Upstream. To delete an attribute, set value of attribute set to null.
   * @param id unique id of upstream
   * @param config {UpstreamDef}
   * @returns {CreateResponse<Upstream>}
   */
  update = async (id: string, config: UpstreamDef, validate = false): Promise<CreateResponse<Upstream>> => {
    if (validate) {
      await this.validationService.validate('upstreams', config);
    }
    const res = await this.client.request<UpstreamDef, CreateResponse<Upstream>>(
      'patch',
      `/apisix/admin/upstreams/${id}`,
      config,
    );

    return res.data;
  };

  /**
   * Updates the attribute specified in the path. The values of other attributes remain unchanged.
   * @param id unique id of upstream
   * @param path like node
   * @param config {UpstreamDef}
   * @returns {CreateResponse<Upstream>}
   */
  updateByPath = async (
    id: string,
    path: string,
    config: UpstreamDef,
    validate = false,
  ): Promise<CreateResponse<Upstream>> => {
    if (validate) {
      await this.validationService.validate('upstreams', config);
    }
    const res = await this.client.request<UpstreamDef, CreateResponse<Upstream>>(
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
    await this.client.request<void, void>('delete', `/apisix/admin/upstreams/${id}`);
  };

  /**
   * Is upstream exists ?
   * @param id unique id of upstream
   * @returns {boolean}
   */
  isExists = async (id: string): Promise<boolean> => {
    try {
      await this.get(id);
      return true;
    } catch (error) {
      if (isAxiosError(error) && error.status === 404) {
        return false;
      }
      throw error;
    }
  };
}
