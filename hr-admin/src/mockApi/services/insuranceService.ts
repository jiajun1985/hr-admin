import { mockRequest } from '../client';
import { getInsurancePlans, getInsuranceProgress } from '../store';
import type { InsurancePlan, InsuranceProgressRecord, PaginationResult } from '../types';

export const insuranceService = {
  async getPlans(): Promise<InsurancePlan[]> {
    const res = await mockRequest(() => getInsurancePlans());
    return res.data!;
  },

  async getProgress(params?: { plan?: string; status?: string }): Promise<PaginationResult<InsuranceProgressRecord>> {
    const res = await mockRequest(() => {
      let data = getInsuranceProgress();
      if (params?.plan) {
        data = data.filter(r => r.insurancePlan === params.plan);
      }
      if (params?.status) {
        data = data.filter(r => r.status === params.status);
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
