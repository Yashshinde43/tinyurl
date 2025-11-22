'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { formatDate } from '@/lib/utils';

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params?.code;
  
  console.log('Stats page - code from params:', code);
  
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [code]);

  const fetchStats = async () => {
    if (!code) {
      setError('Invalid code');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching stats for code:', code);
      const response = await axios.get(`/api/links/${code}`);
      console.log('Stats response:', response.data);
      setLink(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      if (err.response?.status === 404) {
        setError(`Link not found for code: ${code}. Make sure the link exists in the database.`);
      } else {
        setError(err.response?.data?.error || err.message || 'Failed to fetch link stats');
      }
    } finally {
      setLoading(false);
    }
  };

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const shortUrl = `${getBaseUrl()}/${code}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Link Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed information for code: <span className="font-mono font-semibold">{code}</span>
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading stats...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Stats Content */}
        {!loading && !error && link && (
          <div className="space-y-6">
            {/* Main Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Link Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Short Code
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                      {link.code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(shortUrl)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Copy short URL"
                    >
                      📋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Short URL
                  </label>
                  <div className="flex items-center gap-2">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 break-all"
                    >
                      {shortUrl}
                    </a>
                    <button
                      onClick={() => copyToClipboard(shortUrl)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Copy"
                    >
                      📋
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Target URL
                  </label>
                  <div className="flex items-center gap-2">
                    <a
                      href={link.target_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 break-all"
                    >
                      {link.target_url}
                    </a>
                    <a
                      href={link.target_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      title="Open in new tab"
                    >
                      ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {link.total_clicks || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Total Clicks
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(link.last_clicked)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Last Clicked
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(link.created_at)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Created At
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test Redirect
                </a>
                <button
                  onClick={async () => {
                    if (confirm(`Are you sure you want to delete link "${code}"?`)) {
                      try {
                        await axios.delete(`/api/links/${code}`);
                        router.push('/');
                      } catch (err) {
                        alert(`Error: ${err.response?.data?.error || err.message || 'Failed to delete link'}`);
                      }
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

