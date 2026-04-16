import { mockRequest } from '../client';
import { getMessages } from '../store';
import type { Message, PaginationResult } from '../types';

export const messageService = {
  async getMessages(type?: string): Promise<PaginationResult<Message>> {
    const res = await mockRequest(() => {
      let data = getMessages();
      if (type && type !== 'all') {
        data = data.filter(m => m.type === type || (type === 'unread' && !m.isRead));
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
