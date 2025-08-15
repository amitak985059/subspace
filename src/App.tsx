import { NhostProvider as NhostReactProvider } from '@nhost/react';
import { nhost } from './lib/nhost';
import { AuthGate } from './components/AuthGuard';
import { ChatApp } from './components/ChatApp';
import { NetworkStatus } from './components/NetworkStatus';
import { OpenRouterSetup } from './components/OpenRouterSetup';

function App() {
  // Debug Nhost client initialization
  console.log('App rendering with Nhost client:', nhost);
  
  return (
    <NhostReactProvider nhost={nhost}>
      <NetworkStatus />
      <OpenRouterSetup />
      <AuthGate>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900">Chat & Dashboard</h1>
                </div>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    Dashboard
                  </button>
                  <button className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    Chat
                  </button>
                </div>
              </div>
            </div>
          </nav>
          
          <main>
            <ChatApp />
          </main>
        </div>
      </AuthGate>
    </NhostReactProvider>
  );
}

export default App;