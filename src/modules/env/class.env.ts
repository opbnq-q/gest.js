import { EmptyEnvError } from "../../errors/index.errors";

export class Env {
  private readonly env: Record<string, string>;

  constructor() {
    this.env = {};
  }

  get(env: string) {
    if (env in this.env) {
      return this.env[env];
    }
    if (env in process.env) {
      this.env[env] = process.env[env] as string;
      return process.env[env] as string;
    }
  }

  set(env: string, value: string) {
    this.env[env] = value;
  }

  safetyGet(env: string) {
    const value = this.get(env);
    if (value === undefined) throw new EmptyEnvError(env);
    return value;
  }
}
