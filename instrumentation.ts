// instrumentation.ts
// OpenTelemetry instrumentation for Next.js 15+
// This file is automatically loaded by Next.js when the app starts
// Note: @vercel/otel is optional and only needed if NEXT_OTEL_ENABLED=true

export async function register() {
  // Disabled by default - set NEXT_OTEL_ENABLED=true to enable
  // and install @vercel/otel package
  
  // Only register OpenTelemetry in Node.js runtime (not Edge)
  if (process.env['NEXT_RUNTIME'] === 'nodejs') {
    // Check if OpenTelemetry is enabled
    if (process.env['NEXT_OTEL_ENABLED'] === 'true') {
      console.log('OpenTelemetry is enabled but @vercel/otel is not installed.')
      console.log('Install it with: npm install @vercel/otel')
      console.log('Then uncomment the code in instrumentation.ts')
      
      // Uncomment this code after installing @vercel/otel:
      /*
      try {
        const { registerOTel } = await import('@vercel/otel')

        registerOTel({
          serviceName: 'enorae-app',
          tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        })

        console.log('OpenTelemetry instrumentation registered')
      } catch (error: unknown) {
        console.warn(
          'Failed to initialize OpenTelemetry:',
          error instanceof Error ? error.message : ''
        )
      }
      */
    }
  }
}
