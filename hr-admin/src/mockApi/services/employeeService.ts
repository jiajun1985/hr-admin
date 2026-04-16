import { mockRequest } from '../client';
import { getEmployees, setEmployees } from '../store';
import type { Employee, PaginationResult } from '../types';

export const employeeService = {
  async getList(params?: { search?: string; department?: string; status?: string }): Promise<PaginationResult<Employee>> {
    const res = await mockRequest(() => {
      let data = getEmployees();
      if (params?.search) {
        data = data.filter(e =>
          e.name.includes(params.search!) ||
          e.empNo.includes(params.search!) ||
          e.department.includes(params.search!)
        );
      }
      if (params?.department) {
        data = data.filter(e => e.department === params.department);
      }
      if (params?.status) {
        data = data.filter(e => e.status === params.status);
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

  async getById(id: string): Promise<Employee | undefined> {
    const res = await mockRequest(() => getEmployees().find(e => e.id === id || e.empNo === id));
    return res.data;
  },

  async update(id: string, data: Partial<Employee>): Promise<Employee> {
    const res = await mockRequest(() => {
      const employees = getEmployees();
      const index = employees.findIndex(e => e.id === id || e.empNo === id);
      if (index === -1) throw new Error('Employee not found');
      employees[index] = { ...employees[index], ...data };
      setEmployees(employees);
      return employees[index];
    });
    return res.data!;
  },
};
