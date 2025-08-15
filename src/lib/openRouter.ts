// OpenRouterService.ts
import { config, isOpenRouterConfigured } from '../config';

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

export class OpenRouterService {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? config.openRouter.apiKey;
    const masked = this.apiKey ? `${this.apiKey.slice(0, 10)}...` : 'NOT SET';
    console.log('OpenRouter Service initialized:', masked);
  }

  private ensureConfigured() {
    if (!isOpenRouterConfigured()) {
      const err: any = new Error('OpenRouter API key is not configured');
      err.code = 'OPENROUTER_NOT_CONFIGURED';
      throw err;
    }
  }

  async sendMessage(
    message: string,
    conversationHistory: OpenRouterMessage[] = []
  ): Promise<string> {
    console.log('OpenRouter: Attempting to send message:', message);
    console.log('OpenRouter: API Key configured:', !!this.apiKey);
    console.log('OpenRouter: API Key starts with:', this.apiKey ? this.apiKey.substring(0, 10) : 'N/A');
    console.log('OpenRouter: Full API Key:', this.apiKey); // Temporary - remove this in production

    if (!this.apiKey || this.apiKey === 'your-openrouter-api-key-here') {
      throw new Error('OpenRouter API key not configured properly');
    }

    // Validate API key format
    if (!this.apiKey.startsWith('sk-or-')) {
      console.warn('OpenRouter: API key format may be incorrect. Expected format: sk-or-...');
    }

    console.log('OpenRouter: API Key format check:', {
      startsWithSkOr: this.apiKey.startsWith('sk-or-'),
      length: this.apiKey.length,
      firstChars: this.apiKey.substring(0, 10)
    });

    this.ensureConfigured();

    console.log('OpenRouter: Sending message:', message);

    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content:
          'You are a helpful AI assistant. Be conversational, friendly, and concise.'
      },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'X-Title': 'Chat Application'
    };

    // Safe window usage
    if (typeof window !== 'undefined' && window.location?.origin) {
      headers['HTTP-Referer'] = window.location.origin;
    }

    const requestBody = {
      model: config.openRouter.model,
      messages,
      max_tokens: config.openRouter.maxTokens,
      temperature: config.openRouter.temperature
    };

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });
    } catch (fetchError) {
      throw new Error(`Network error contacting OpenRouter: ${fetchError}`);
    }

    console.log('OpenRouter: Response status:', res.status);

    if (res.status === 401) {
      const text = await res.text();
      throw new Error(`OpenRouter 401 (check API key): ${text}`);
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenRouter error ${res.status}: ${text}`);
    }

    const data: OpenRouterResponse = await res.json();
    const aiResponse = data?.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response received from OpenRouter API');
    }

    console.log('OpenRouter: AI response:', aiResponse);
    return aiResponse;
  }
}

// Singleton
export const openRouterService = new OpenRouterService();
