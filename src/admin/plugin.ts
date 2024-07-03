/* eslint-disable @typescript-eslint/no-explicit-any */

import ApisixAdminClient from '../client';

export default class PluginService {
  private readonly client: ApisixAdminClient;
  constructor(client: ApisixAdminClient) {
    this.client = client;
  }

  /**
   * Fetches a list of all Plugins.
   * @returns {PluginList}
   */
  getList = async (): Promise<string[]> => {
    const res = await this.client.request<null, string[]>('get', `/apisix/admin/plugins/list`);

    return res.data;
  };

  /**
   * Get properties for config a plugin
   * @param pluginName
   * @returns {any}
   */
  getProperties = async (pluginName: string): Promise<any> => {
    const res = await this.client.request<null, any>('get', `/apisix/admin/plugins/${pluginName}`);

    return res.data;
  };

  /**
   * Reloads the plugin according to the changes made in code
   * @returns {void}
   */
  reload = async (): Promise<void> => {
    const res = await this.client.request<null, void>('put', `/apisix/admin/plugins/reload`);

    return res.data;
  };

  isExists = async (name: string): Promise<boolean> => {
    const plugins = await this.getList();
    return plugins.indexOf(name) > -1;
  };
}
