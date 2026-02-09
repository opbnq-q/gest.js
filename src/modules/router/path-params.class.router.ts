export class PathParams {
  private readonly params: Map<string, string>;

  constructor() {
    this.params = new Map();
  }

  setParam(key: string, value: string) {
    this.params.set(key, value);
  }

  getParam(key: string): string | undefined {
    return this.params.get(key);
  }

  getAllParams(): Record<string, string> {
    const paramsObj: Record<string, string> = {};
    for (const [key, value] of this.params.entries()) {
      paramsObj[key] = value;
    }
    return paramsObj;
  }
}
