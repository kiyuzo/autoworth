'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ValuationHistory {
  req_id: number;
  brand: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
  estimated_price: number;
  request_date: string;
  valuation_date: string;
  user_name: string;
}

export default function History() {
  const [history, setHistory] = useState<ValuationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { dbUser } = useAuth();

  useEffect(() => {
    if (dbUser?.user_id) {
      fetchHistory();
    }
  }, [dbUser]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/history?userId=${dbUser?.user_id}&limit=20`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to fetch valuation history');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h1>
          <p className="text-gray-600">You need to login to view your valuation history.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your valuation history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchHistory}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Valuation History</h1>
          <p className="mt-2 text-gray-600">
            Your car valuation history ({history.length} valuations)
          </p>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">No Valuations Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't performed any car valuations yet. Start by valuating your first car!
            </p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Start Valuation
            </a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {history.map((valuation) => (
              <div key={valuation.req_id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {valuation.brand} {valuation.model}
                    </h3>
                    <p className="text-sm text-gray-600">{valuation.trim}</p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    #{valuation.req_id}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Year:</span>
                    <span className="text-sm font-medium">{valuation.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mileage:</span>
                    <span className="text-sm font-medium">{valuation.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estimated Price:</span>
                    <span className="text-sm font-bold text-green-600">
                      {formatPrice(valuation.estimated_price)}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    Valuated on {formatDate(valuation.valuation_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}