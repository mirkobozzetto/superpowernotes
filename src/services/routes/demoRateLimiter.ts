import { MAX_TRIAL_COUNT, RATE_LIMIT_WINDOW } from "@src/constants/demoConstants";

type RateLimitInfo = {
  count: number;
  timestamp: number;
};

export class DemoRateLimiter {
  private ipRequestCounts = new Map<string, RateLimitInfo>();

  checkRateLimit(clientIp: string): boolean {
    const now = Date.now();
    const requestInfo = this.ipRequestCounts.get(clientIp);

    if (requestInfo && now - requestInfo.timestamp < RATE_LIMIT_WINDOW) {
      if (requestInfo.count >= MAX_TRIAL_COUNT) {
        return false;
      }
      requestInfo.count += 1;
      return true;
    }

    this.ipRequestCounts.set(clientIp, { count: 1, timestamp: now });
    return true;
  }
}

export const demoRateLimiter = new DemoRateLimiter();
