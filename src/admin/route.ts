import { isAxiosError } from 'axios';
import { GetListRoute, Route, RouteDef } from '../../types/admin/route';
import { CreateResponse, GetResponse, PaginationResponse } from '../../types/client';
import ApisixAdminClient from '../client';
import ValidationService from './validation';

export default class RouteService {
  private readonly client: ApisixAdminClient;
  private readonly validationService: ValidationService;
  constructor(client: ApisixAdminClient) {
    this.client = client;
    this.validationService = new ValidationService(client);
  }

  private readonly isJson = (json: string): boolean => {
    try {
      JSON.parse(json);
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Fetches specified Route by id.
   * @param id
   * @returns
   */
  get = async (id: string): Promise<GetResponse<Route>> => {
    const res = await this.client.request<null, GetResponse<Route>>('get', `/apisix/admin/routes/${id}`);
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
    page?: string,
    page_size?: string,
  ): Promise<PaginationResponse<GetResponse<Route>>> => {
    const res = await this.client.request<GetListRoute, PaginationResponse<GetResponse<Route>>>(
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

  filter = async (
    name?: string,
    uri?: string,
    status?: '0' | '1',
    host?: string,
    id?: string,
    desc?: string,
    labels?: string,
    page = '1',
    page_size = '10',
  ) => {
    const bufferValues = (await this.client.etcd.getAll().prefix('/apisix/routes').exec()).kvs.filter((kv) => {
      return this.isJson(kv.value.toString('utf8'));
    });

    let routes = bufferValues.map((bufferValue) => {
      return {
        ...bufferValue,
        key: bufferValue.key.toString('utf8'),
        value: JSON.parse(bufferValue.value.toString('utf8')),
      };
    });

    for await (const route of routes) {
      const upstream_id = route.value.upstream_id;
      if (upstream_id) {
        const upstream = (await this.client.etcd.get(`/apisix/upstreams/${upstream_id}`).exec()).kvs[0];
        if (upstream) {
          const value = JSON.parse(upstream.value.toString('utf8'));
          const nodes = value.nodes;
          if (nodes) {
            route.value.upstream = value;
          }
        }
      }
    }

    if (name) {
      routes = routes.filter((route) => (route.value.name as string).includes(name));
    }
    if (uri) {
      routes = routes.filter((route) => (route.value.uri as string).includes(uri));
    }
    if (status) {
      routes = routes.filter((route) => route.value.status === +status);
    }
    if (id) {
      routes = routes.filter((route) => (route.value.id as string).includes(id));
    }
    if (desc) {
      routes = routes.filter((route) => (route.value.desc as string).includes(desc));
    }
    if (host) {
      routes = routes.filter(
        (route) =>
          route.value.upstream && route.value.upstream.nodes && Object.keys(route.value.upstream.nodes).includes(host),
      );
    }
    if (labels) {
      const isSearchObjJson = this.isJson(labels);
      if (isSearchObjJson) {
        const searchObj = JSON.parse(labels);
        const keysSearchObj = Object.keys(searchObj);
        routes = routes.filter((route) => {
          const sourceObj = route.value.labels;
          if (sourceObj) {
            const keysSourceObj = Object.keys(sourceObj);
            return keysSearchObj.some((key) => keysSourceObj.includes(key) && searchObj[key] === sourceObj[key]);
          }
        });
      }
    }

    return {
      list: routes
        .slice((parseInt(page) - 1) * parseInt(page_size), parseInt(page) * parseInt(page_size))
        .map((slicedRoute) => slicedRoute.value as RouteDef),
      total: routes.length,
    };
  };

  /**
   * Creates a Route and assigns a random id.
   * @param config
   * @returns
   */
  create = async (config: RouteDef, validate = false): Promise<CreateResponse<Route>> => {
    if (validate) {
      await this.validationService.validate('routes', config);
    }
    const res = await this.client.request<RouteDef, CreateResponse<Route>>('post', `/apisix/admin/routes`, config);
    return res.data;
  };

  /**
   * Creates a Route with the specified id.
   * @param id
   * @param ttl
   * @param config
   * @returns
   */
  upsert = async (id: string, config: RouteDef, ttl?: string, validate = false): Promise<CreateResponse<Route>> => {
    if (validate) {
      await this.validationService.validate('routes', config);
    }
    const res = await this.client.request<RouteDef, CreateResponse<Route>>(
      'put',
      `/apisix/admin/routes/${id}${ttl ? `?ttl=${ttl}` : ''}`,
      config,
    );
    return res.data;
  };

  /**
   * Updates the selected attributes of the specified, existing Route. To delete an attribute, set value of attribute set to null.
   * @param id
   * @param config
   * @returns
   */
  update = async (id: string, config: RouteDef, validate = false): Promise<CreateResponse<Route>> => {
    if (validate) {
      await this.validationService.validate('routes', config);
    }
    const res = await this.client.request<RouteDef, CreateResponse<Route>>(
      'patch',
      `/apisix/admin/routes/${id}`,
      config,
    );
    return res.data;
  };

  /**
   * Updates the attribute specified in the path. The values of other attributes remain unchanged.
   * @param id
   * @param path
   * @param config
   * @returns
   */
  updateByPath = async (
    id: string,
    path: string,
    config: RouteDef,
    validate = false,
  ): Promise<CreateResponse<Route>> => {
    if (validate) {
      await this.validationService.validate('routes', config);
    }
    const res = await this.client.request<RouteDef, CreateResponse<Route>>(
      'patch',
      `/apisix/admin/routes/${id}/${path}`,
      config,
    );
    return res.data;
  };

  /**
   * Removes the Route with the specified id.
   * @param id
   */
  delete = async (id: string): Promise<void> => {
    await this.client.request<void, void>('delete', `/apisix/admin/routes/${id}`);
  };

  isExists = async (id: string): Promise<boolean> => {
    try {
      await this.get(id);
      return true;
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 404) {
        return false;
      } else {
        throw error;
      }
    }
  };
}
