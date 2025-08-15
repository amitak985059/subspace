import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { isOpenRouterConfigured } from '../config';

export const OpenRouterSetup: React.FC = () => {
  if (isOpenRouterConfigured()) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-sm shadow-lg z-50">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-yellow-800">OpenRouter API Key Required</h4>
          <p className="text-xs text-yellow-700 mt-1">
            To enable AI chatbot responses, you need to configure your OpenRouter API key.
          </p>
          <div className="mt-3 space-y-2">
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-yellow-700 hover:text-yellow-800 underline"
            >
              <span>Get API Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-xs text-yellow-600">
              Add <code className="bg-yellow-100 px-1 rounded">VITE_OPENROUTER_API_KEY=your_key</code> to your .env file
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
