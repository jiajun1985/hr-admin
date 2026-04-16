import { mockRequest } from '../client';
import { getDepartments, setDepartments } from '../store';
import type { Department } from '../types';

export const departmentService = {
  async getTree(): Promise<Department[]> {
    const res = await mockRequest(() => getDepartments());
    return res.data!;
  },

  async update(data: Partial<Department> & { id: string }): Promise<Department> {
    const res = await mockRequest(() => {
      const departments = getDepartments();
      const updateNode = (nodes: Department[]): boolean => {
        for (const node of nodes) {
          if (node.id === data.id) {
            Object.assign(node, data);
            return true;
          }
          if (node.children && updateNode(node.children)) return true;
        }
        return false;
      };
      updateNode(departments);
      setDepartments(departments);
      return data as Department;
    });
    return res.data!;
  },
};
