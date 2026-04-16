import { mockRequest } from '../client';
import { getOperationLogs } from '../store';
import type { OperationLog, PaginationResult } from '../types';

export const logService = {
  async getLogs(params?: { module?: string; status?: string; operator?: string }): Promise<PaginationResult<OperationLog>> {
    const res = await mockRequest(() => {
      let data = getOperationLogs();
      if (params?.module) {
        data = data.filter(l => l.module === params.module);
      }
      if (params?.status) {
        data = data.filter(l => l.status === params.status);
      }
      if (params?.operator) {
        data = data.filter(l => l.operator === params.operator);
      }
      return {
        list: data,
        total: data.length,
        page: 1,
        pageSize: data.length,
      };
    });
    return res.data!;
  },
};
