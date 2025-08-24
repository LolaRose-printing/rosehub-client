"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { checkAdminAccess } from '@/lib/client-fetcher';

export function AdminPanel() {
  const { user } = useAuth();
  const [adminStatus, setAdminStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAdminCheck = async () => {
    setLoading(true);
    try {
      const result = await checkAdminAccess();
      setAdminStatus(`Admin access granted: ${result.message}`);
    } catch (error) {
      setAdminStatus(`Admin access denied: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const userRoles = user?.['https://rosehub.com/roles'] || user?.roles || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold">User Information:</h3>
        <p>Email: {user?.email}</p>
        <p>Name: {user?.name}</p>
        <p>Roles: {userRoles.length > 0 ? userRoles.join(', ') : 'No roles assigned'}</p>
      </div>

      <button
        onClick={handleAdminCheck}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Checking...' : 'Check Admin Access'}
      </button>

      {adminStatus && (
        <div className={`mt-4 p-3 rounded ${
          adminStatus.includes('granted') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {adminStatus}
        </div>
      )}
    </div>
  );
}