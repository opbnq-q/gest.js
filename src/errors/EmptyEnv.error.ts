export class EmptyEnvError extends Error {
  constructor(env: string) {
    super(`Env ${env} is empty`);
    this.name = "EmptyEnvError";
  }
}
