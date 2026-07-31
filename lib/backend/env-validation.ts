/**
 * lib/backend/env-validation.ts
 *
 * Environment variable validation — runs at server startup.
 * Ensures all required API keys are configured before the server
 * processes requests.
 */

export interface EnvValidationResult {
  success: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Validate that all required environment variables are set.
 * Call this in middleware or at server startup.
 */
export function validateEnvironment(): EnvValidationResult {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'GROQ_API_KEY',
    'TAVILY_API_KEY',
  ];

  const optional = ['FIRECRAWL_API_KEY', 'GEMINI_API_KEY'];

  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const key of required) {
    const value = process.env[key];
    if (!value || value.trim() === '') {
      missing.push(key);
    }
  }

  // Check optional variables
  for (const key of optional) {
    const value = process.env[key];
    if (!value || value.trim() === '') {
      warnings.push(`${key} is not configured — some features may be unavailable`);
    }
  }

  if (missing.length > 0) {
    const error = new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file and ensure all required keys are set.'
    );
    console.error('❌ Environment Validation Failed:', error.message);
    throw error;
  }

  if (warnings.length > 0) {
    warnings.forEach(w => console.warn('⚠️  ' + w));
  }

  console.log('✅ Environment validation passed');
  return {
    success: true,
    missing: [],
    warnings,
  };
}

/**
 * Get an API key with validation.
 * Returns the value or throws an error if not configured.
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`Required environment variable not set: ${key}`);
  }
  return value;
}

/**
 * Get an optional API key.
 * Returns the value or empty string if not configured.
 */
export function getOptionalEnv(key: string): string {
  return process.env[key] || '';
}
