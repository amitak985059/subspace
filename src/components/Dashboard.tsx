import React from 'react';
import { useUserData, useSignOut } from '@nhost/react';
import { LogOut, User, Calendar, Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const user = useUserData();
  const { signOut } = useSignOut();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName || user?.email}!
          </h2>
          <p className="text-gray-600">Here's what's happening with your account today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">Manage your account information</p>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Email:</span> {user?.email}</p>
              <p className="text-sm"><span className="font-medium">ID:</span> {user?.id}</p>
              <p className="text-sm">
                <span className="font-medium">Verified:</span> 
                <span className={`ml-1 ${user?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                  {user?.emailVerified ? 'Yes' : 'No'}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">Your recent activity and usage</p>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Status:</span> Active</p>
              <p className="text-sm"><span className="font-medium">Last Login:</span> Just now</p>
              <p className="text-sm"><span className="font-medium">Sessions:</span> 1 active</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Account</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">Account details and settings</p>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Created:</span> 
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
              <p className="text-sm"><span className="font-medium">Role:</span> User</p>
              <p className="text-sm"><span className="font-medium">Plan:</span> Free</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Complete Your Profile</h4>
              <p className="text-blue-700 text-sm">Add more information to your profile to get personalized experiences.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Explore Features</h4>
              <p className="text-green-700 text-sm">Discover all the features available to you in this application.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};