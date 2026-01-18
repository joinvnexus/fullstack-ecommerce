'use client';

import React from 'react';
import { Settings, ToggleLeft } from 'lucide-react';

const SettingsSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Settings</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-gray-600">Receive order update emails</p>
          </div>
          <ToggleLeft className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Dark Mode</h3>
            <p className="text-sm text-gray-600">Change theme</p>
          </div>
          <ToggleLeft className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;