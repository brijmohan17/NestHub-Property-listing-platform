import React, { useEffect, useState } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { fetchOAuthProviders, startOAuthLogin } from '../utils/api';

const OAuthButtons = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOAuthProviders()
      .then((data) => setProviders(data.enabled ? data.providers : []))
      .catch(() => setProviders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || providers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {providers.includes('google') && (
          <button
            type="button"
            onClick={() => startOAuthLogin('google')}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
          >
            <FaGoogle className="text-[#4285F4]" />
            Google
          </button>
        )}
        {providers.includes('github') && (
          <button
            type="button"
            onClick={() => startOAuthLogin('github')}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
          >
            <FaGithub className="text-gray-900" />
            GitHub
          </button>
        )}
      </div>
    </div>
  );
};

export default OAuthButtons;
