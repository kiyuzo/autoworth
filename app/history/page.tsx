'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ValuationHistory {
  req_id: number;
  brand: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
  estimated_price: number;
  created_at: string; // This should match the API response
}

export default function History() {
  const { dbUser } = useAuth();
  const [history, setHistory] = useState<ValuationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (dbUser?.user_id) {
      fetchHistory();
    }
  }, [dbUser]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/valuation?userId=${dbUser?.user_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      setHistory(data.valuations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = history.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>Loading history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        {history.length === 0 ? (
          <div className="text-center text-lg" style={{ color: 'var(--text-secondary)' }}>
            No valuation history found.
          </div>
        ) : (
          <>
            {/* History Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentItems.map((item) => (
                <div
                  key={item.req_id}
                  className="bg-white bg-opacity-95 rounded-lg shadow-md p-6 border border-gray-200"
                >
                  {/* Upper Part */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xl font-bold text-[#001233]">
                          {item.brand}
                        </span>
                        <span className="text-xl font-bold text-[#001233]">
                          {item.model}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 font-light">
                        {item.trim}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(item.created_at)} {/* Use created_at instead of request_date */}
                    </div>
                  </div>

                  {/* Separator Line */}
                  <hr className="border-gray-200 mb-4" />

                  {/* Bottom Part */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Year:</span>
                      <span className="text-gray-900">{item.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Mileage:</span>
                      <span className="text-gray-900">{item.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Estimated Price:</span>
                      <span className="text-green-600 font-semibold">
                        {formatPrice(item.estimated_price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                {/* Previous Button */}
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-lg border ${
                        page === currentPage
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
