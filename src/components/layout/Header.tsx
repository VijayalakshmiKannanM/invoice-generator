'use client';

import { useSession } from 'next-auth/react';
import { User } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between h-16 px-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Welcome back, {session?.user?.name || 'User'}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              {session?.user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
