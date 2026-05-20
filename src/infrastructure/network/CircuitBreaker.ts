type ServiceCall<T> = () => Promise<T>;

enum State { CLOSED, OPEN, HALF_OPEN }

export class CircuitBreaker {
  private state: State = State.CLOSED;
  private failureThreshold: number = 5;
  private failureCount: number = 0;
  private nextAttempt: number = 0;
  private timeout: number = 30000;

  async execute<T>(fn: ServiceCall<T>): Promise<T> {
    if (this.state === State.OPEN) {
      if (Date.now() > this.nextAttempt) {
        this.state = State.HALF_OPEN;
      } else {
        throw new Error("Servicio no disponible");
      }
    }
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = State.CLOSED;
  }

  private onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = State.OPEN;
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

export const apiBreaker = new CircuitBreaker();
