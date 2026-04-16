import type { MockResponse } from './types';

interface RequestOptions {
  delay?: number;
  shouldFail?: boolean;
  errorMessage?: string;
}

const DEFAULT_DELAY = 300;
const DELAY_VARIANCE = 400;

export function mockRequest<T>(
  handler: () => T | Promise<T>,
  options?: RequestOptions
): Promise<MockResponse<T>> {
  const delay = options?.delay ?? DEFAULT_DELAY + Math.random() * DELAY_VARIANCE;
  const shouldFail = options?.shouldFail ?? false;

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        if (shouldFail) {
          resolve({
            success: false,
            data: null as T,
            message: options?.errorMessage || '请求失败，请稍后重试',
          });
          return;
        }

        const result = await handler();
        resolve({
          success: true,
          data: result,
        });
      } catch (error) {
        resolve({
          success: false,
          data: null as T,
          message: error instanceof Error ? error.message : '未知错误',
        });
      }
    }, delay);
  });
}

// Simulate loading states for UI development
export function createLoadingDelay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
