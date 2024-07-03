/* eslint-disable @typescript-eslint/no-explicit-any */

import { ValidationResource } from '../../types/admin/validation';
import ApisixAdminClient from '../client';

export default class ValidationService {
  private readonly client: ApisixAdminClient;
  constructor(client: ApisixAdminClient) {
    this.client = client;
  }

  validate = async (resource: ValidationResource, schema: any) => {
    const res = await this.client.request<any, any>('post', `/apisix/admin/schema/validate/${resource}`, schema);
    return res.data;
  };
}
