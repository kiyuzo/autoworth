'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PredictionData {
  brand: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
  predicted_price: number;
  is_mock: boolean;
  prediction_method: string;
  timestamp: string;
}

const ResultPage = () => {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const generateMockPrediction = () => {
      try {
        // Get car data from localStorage
        const carDataStr = localStorage.getItem('carPredictionData');
        
        if (!carDataStr) {
          setError('No car data found. Please submit car details first.');
          setLoading(false);
          return;
        }

        const carData = JSON.parse(carDataStr);
        
        // Generate realistic mock price based on car data
        const generateMockPrice = (brand: string, year: number, mileage: number) => {
          const brandPrices = {
            'Toyota': 25000,
            'Honda': 24000,
            'Ford': 22000,
            'Chevrolet': 21000,
            'BMW': 45000,
            'Mercedes': 50000,
            'Audi': 42000,
            'Nissan': 23000,
            'Hyundai': 20000,
            'Kia': 19000,
            'Volkswagen': 25000,
            'Mazda': 22000,
            'Subaru': 26000
          };

          const basePrice = brandPrices[brand] || 22000;
          const currentYear = new Date().getFullYear();
          const age = currentYear - year;
          
          // Depreciation: 15% per year
          const ageAdjustedPrice = basePrice * Math.pow(0.85, age);
          
          // Mileage adjustment: -$0.05 per mile
          const mileageAdjustedPrice = ageAdjustedPrice - (mileage * 0.05);
          
          // Add some randomness ±10%
          const randomFactor = 0.9 + (Math.random() * 0.2);
          const finalPrice = Math.max(3000, mileageAdjustedPrice * randomFactor);
          
          // Round to nearest $500
          return Math.round(finalPrice / 500) * 500;
        };

        const mockPrice = generateMockPrice(carData.brand, carData.year, carData.mileage);

        const mockPrediction: PredictionData = {
          brand: carData.brand,
          model: carData.model,
          trim: carData.trim,
          year: carData.year,
          mileage: carData.mileage,
          predicted_price: mockPrice,
          is_mock: true,
          prediction_method: 'mock_algorithm',
          timestamp: new Date().toISOString()
        };

        setPrediction(mockPrediction);
        setLoading(false);

      } catch (err) {
        console.error('Error generating mock prediction:', err);
        setError('Failed to generate prediction');
        setLoading(false);
      }
    };

    generateMockPrediction();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating your car valuation...</p>
        </div>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Prediction Data</h2>
          <p className="text-gray-600 mb-6">{error || 'Please submit car details first'}</p>
          <Link
            href="/predicts"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Get New Prediction
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: white !important;
          }
          .bg-gray-50 {
            background: white !important;
          }
          .shadow-lg,
          .shadow-md {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
          .rounded-lg {
            border-radius: 0 !important;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header - No Print */}
          <div className="text-center mb-8 no-print">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Car Value Assessment Complete!</h1>
            <p className="mt-2 text-gray-600">Your mock prediction results are ready</p>
          </div>

          {/* Print Header - Print Only */}
          <div className="print-only mb-8 text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-900">AutoWorth - Car Value Assessment</h1>
            <p className="text-gray-600">Professional Vehicle Valuation Report</p>
            <p className="text-sm text-gray-500">Generated on {new Date().toLocaleString()}</p>
          </div>

          {/* Mock Disclaimer Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Mock Prediction Result
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    This is a simulated valuation for demonstration purposes. We are still figuring out how to integrate the real AI model🙏🙏🙏. The displayed price is generated by a mock algorithm and does not reflect actual market conditions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Car Image Placeholder */}
              <div className="md:w-1/2">
                <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.5 8.5L12 12l7-7" />
                      <circle cx="12" cy="12" r="10" strokeWidth={1} />
                    </svg>
                    <div className="space-y-2">
                      <div className="bg-gray-300 h-4 w-32 mx-auto rounded"></div>
                      <div className="bg-gray-300 h-3 w-24 mx-auto rounded"></div>
                    </div>
                    <p className="text-gray-500 text-sm mt-4 font-semibold">
                      {prediction.brand}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {prediction.year} {prediction.model} {prediction.trim}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Stock photo placeholder
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="md:w-1/2 p-6">
                <div className="space-y-6">
                  {/* Price Display */}
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                      {formatPrice(prediction.predicted_price)}
                    </h2>
                    <p className="text-gray-600">Estimated Market Value</p>
                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Mock Prediction
                    </div>
                  </div>

                  {/* Vehicle Specifications */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Specifications</h3>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Make</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-semibold">{prediction.brand}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Model</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-semibold">{prediction.model}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Trim Level</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-semibold">{prediction.trim}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Year</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-semibold">{prediction.year}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Mileage</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-semibold">{prediction.mileage.toLocaleString()} miles</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Vehicle Age</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-semibold">{new Date().getFullYear() - prediction.year} years</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Prediction Details */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Prediction Details</h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Method</dt>
                        <dd className="mt-1 text-sm text-gray-900">AI-Powered Mock Algorithm</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Confidence Level</dt>
                        <dd className="mt-1 text-sm text-gray-900">Simulated (Demo Purpose)</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Generated</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(prediction.timestamp)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - No Print */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center no-print">
            <button
              onClick={handlePrint}
              className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Report
            </button>
            <Link
              href="/predicts"
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Another Prediction
            </Link>
            <Link
              href="/"
              className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Home
            </Link>
          </div>

          {/* Footer Disclaimer */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Important Disclaimer</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This is a <strong>mock demonstration</strong> of an AI-powered car valuation system. The displayed price is generated by a simulation algorithm for development and testing purposes only. This is not a real market appraisal and should not be used for actual buying, selling, or insurance decisions. For accurate vehicle valuations, please consult professional automotive appraisers or established valuation services.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Print Footer - Print Only */}
          <div className="print-only mt-8 pt-4 border-t text-center text-xs text-gray-500">
            <p>This report was generated by AutoWorth Demo System | Mock Prediction for Testing Purposes</p>
            <p>For real valuations, consult professional automotive appraisers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;