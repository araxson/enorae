export class RateLimitError extends Error {
  constructor(message: string, public readonly resetIn: number, public readonly limit: number) {
    super(message)
    this.name = 'RateLimitError'
  }
}
