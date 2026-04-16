import { mockRequest } from '../client';
import { getBanners, getModules, setBanners, setModules } from '../store';
import type { BannerItem, ModuleOption } from '../types';

export const configService = {
  async getBanners(): Promise<BannerItem[]> {
    const res = await mockRequest(() => getBanners());
    return res.data!;
  },

  async updateBanners(banners: BannerItem[]): Promise<void> {
    await mockRequest(() => {
      setBanners(banners);
    });
  },

  async getModules(): Promise<ModuleOption[]> {
    const res = await mockRequest(() => getModules());
    return res.data!;
  },

  async updateModules(modules: ModuleOption[]): Promise<void> {
    await mockRequest(() => {
      setModules(modules);
    });
  },
};
