import { mockRequest } from '../client';
import { getBills, setBills } from '../store';
import type { Bill, PaginationResult } from '../types';

export const billService = {
  async getList(params?: { search?: string; status?: string }): Promise<PaginationResult<Bill>> {
    const res = await mockRequest(() => {
      let data = getBills();
      if (params?.search) {
        data = data.filter(b => b.billNo.includes(params.search!) || b.companyName.includes(params.search!));
      }
      if (params?.status) {
        data = data.filter(b => b.status === params.status);
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

  async update(id: string, data: Partial<Bill>): Promise<Bill> {
    const res = await mockRequest(() => {
      const bills = getBills();
      const index = bills.findIndex(b => b.id === id);
      if (index === -1) throw new Error('Bill not found');
      bills[index] = { ...bills[index], ...data };
      setBills(bills);
      return bills[index];
    });
    return res.data!;
  },
};
