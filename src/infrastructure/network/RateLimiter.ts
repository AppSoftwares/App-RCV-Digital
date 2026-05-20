class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly LIMIT = 10;
  private readonly WINDOW_MS = 60000;

  isAllowed(key: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    const recentRequests = userRequests.filter(timestamp => now - timestamp < this.WINDOW_MS);
    if (recentRequests.length >= this.LIMIT) return false;
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }
}

export const globalRateLimiter = new RateLimiter();
