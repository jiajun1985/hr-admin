import { mockRequest } from '../client';
import { getAnnouncements, setAnnouncements } from '../store';
import type { Announcement, PaginationResult } from '../types';

export const announcementService = {
  async getList(params?: { type?: string; status?: string }): Promise<PaginationResult<Announcement>> {
    const res = await mockRequest(() => {
      let data = getAnnouncements();
      if (params?.type) {
        data = data.filter(a => a.type === params.type);
      }
      if (params?.status) {
        data = data.filter(a => a.status === params.status);
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

  async create(data: Partial<Announcement>): Promise<Announcement> {
    const res = await mockRequest(() => {
      const announcements = getAnnouncements();
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: data.title || '',
        content: data.content || '',
        type: data.type || 'notice',
        targetScope: data.targetScope || '全体员工',
        publishTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
        publisher: '管理员',
        status: data.status || 'published',
        readCount: 0,
        viewCount: 0,
      };
      announcements.unshift(newAnnouncement);
      setAnnouncements(announcements);
      return newAnnouncement;
    });
    return res.data!;
  },
};
