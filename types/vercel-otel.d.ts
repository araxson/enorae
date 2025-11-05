// Type declarations for optional @vercel/otel package
// Install with: npm install @vercel/otel

declare module '@vercel/otel' {
  export function registerOTel(config: {
    serviceName: string
    tracesSampleRate: number
  }): void
}
