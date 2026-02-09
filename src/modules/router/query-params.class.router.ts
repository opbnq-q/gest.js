export class QueryParams {
  private readonly params: Map<string, string | string[]>;

  constructor() {
    this.params = new Map();
  }

  setParam(key: string, value: string | string[]) {
    this.params.set(key, value);
  }

  appendParam(key: string, value: string) {
    const existing = this.params.get(key);
    if (!existing) {
      this.params.set(key, value);
      return;
    }
    if (Array.isArray(existing)) {
      existing.push(value);
      this.params.set(key, existing);
      return;
    }
    this.params.set(key, [existing, value]);
  }

  getParam(key: string): string | string[] | undefined {
    return this.params.get(key);
  }

  getAllParams(): Record<string, string | string[]> {
    const paramsObj: Record<string, string | string[]> = {};
    for (const [key, value] of this.params.entries()) {
      paramsObj[key] = value;
    }
    return paramsObj;
  }
}
