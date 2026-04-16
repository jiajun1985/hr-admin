import { mockRequest } from '../client';
import { getMedicalPlans, getMedicalRecords } from '../store';
import type { MedicalPlan, MedicalRecord, PaginationResult } from '../types';

export const medicalService = {
  async getPlans(): Promise<MedicalPlan[]> {
    const res = await mockRequest(() => getMedicalPlans());
    return res.data!;
  },

  async getRecords(): Promise<PaginationResult<MedicalRecord>> {
    const res = await mockRequest(() => {
      const data = getMedicalRecords();
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
