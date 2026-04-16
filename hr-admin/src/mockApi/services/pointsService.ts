import { mockRequest } from '../client';
import { getEmployeePoints, getPointsRecords } from '../store';
import type { EmployeePoints, PointsRecord, PaginationResult } from '../types';

export const pointsService = {
  async getEmployeePoints(): Promise<PaginationResult<EmployeePoints>> {
    const res = await mockRequest(() => {
      const data = getEmployeePoints();
      return {
        list: data,
        total: data.length,
        page: 1,
        pageSize: data.length,
      };
    });
    return res.data!;
  },

  async getRecords(): Promise<PaginationResult<PointsRecord>> {
    const res = await mockRequest(() => {
      const data = getPointsRecords();
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
