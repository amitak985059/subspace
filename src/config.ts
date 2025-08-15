// Configuration file for API keys and settings
export const config = {
  // OpenRouter AI Configuration
  openRouter: {
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || 'your-api-key-here',
    model: 'openai/gpt-4o-mini',
    maxTokens: 500,
    temperature: 0.7
  },
  
  // Nhost Configuration
  nhost: {
    subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN || 'tsbwjtsnekcocprbjdtr',
    region: import.meta.env.VITE_NHOST_REGION || 'ap-south-1'
  }
};

// Debug logging
console.log('=== CONFIG DEBUG ===');
console.log('Environment variables available:', {
  VITE_OPENROUTER_API_KEY: import.meta.env.VITE_OPENROUTER_API_KEY ? 'SET' : 'NOT SET',
  VITE_NHOST_SUBDOMAIN: import.meta.env.VITE_NHOST_SUBDOMAIN ? 'SET' : 'NOT SET',
  VITE_NHOST_REGION: import.meta.env.VITE_NHOST_REGION ? 'SET' : 'NOT SET'
});
console.log('Config loaded:', {
  openRouterApiKey: config.openRouter.apiKey ? `${config.openRouter.apiKey.substring(0, 10)}...` : 'NOT SET',
  openRouterApiKeyLength: config.openRouter.apiKey?.length || 0,
  openRouterApiKeyFull: config.openRouter.apiKey, // Temporary - remove in production
  nhostSubdomain: config.nhost.subdomain,
  nhostRegion: config.nhost.region
});
console.log('=== END CONFIG DEBUG ===');

// Check if OpenRouter API key is configured
export const isOpenRouterConfigured = () => {
  const configured = config.openRouter.apiKey && config.openRouter.apiKey !== 'your-api-key-here';
  console.log('OpenRouter configured check:', configured);
  return configured;
};
