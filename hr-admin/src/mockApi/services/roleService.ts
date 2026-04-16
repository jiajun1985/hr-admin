import { mockRequest } from '../client';
import { getRoles, getPermissions, setRoles } from '../store';
import type { Role, Permission } from '../types';

export const roleService = {
  async getRoles(): Promise<Role[]> {
    const res = await mockRequest(() => getRoles());
    return res.data!;
  },

  async getPermissions(): Promise<Permission[]> {
    const res = await mockRequest(() => getPermissions());
    return res.data!;
  },

  async updateRolePermissions(roleId: string, permissions: string[]): Promise<Role> {
    const res = await mockRequest(() => {
      const roles = getRoles();
      const index = roles.findIndex(r => r.id === roleId);
      if (index === -1) throw new Error('Role not found');
      roles[index] = { ...roles[index], permissions };
      setRoles(roles);
      return roles[index];
    });
    return res.data!;
  },
};
