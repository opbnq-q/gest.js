export class MethodIsAlreadyDefined extends Error {
  constructor(method: string) {
    super(`Method ${method} is already defined`);
  }
}
