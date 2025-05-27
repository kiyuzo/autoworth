'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Car Data (same as in main page.tsx)
const carData = {
  Audi: {
    models: {
      "A3": [
        "1.8T Premium Cabriolet FWD",
        "1.8T Premium Sedan FWD",
      ],
    }
  },
};

interface User {
  id: number;
  username: string;
  email: string;
}

interface CarData {
  brand: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
}

interface PredictionResponse {
  success: boolean;
  predicted_price: number;
  car_details: CarData;
  using_fallback?: boolean;
  error?: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  error?: string;
}

const PredictPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Car form state
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [trim, setTrim] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");

  const [brandInput, setBrandInput] = useState("");
  const [modelInput, setModelInput] = useState("");
  const [trimInput, setTrimInput] = useState("");

  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showTrimDropdown, setShowTrimDropdown] = useState(false);

  // Prediction state
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for blur handling
  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const trimDropdownRef = useRef<HTMLDivElement>(null);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data: AuthResponse = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          // Redirect to main page instead of login page
          router.push('/');
        }
      } else {
        // Redirect to main page instead of login page
        router.push('/');
      }
    } catch (err) {
      console.error('Auth check error:', err);
      // Redirect to main page instead of login page
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      // Redirect to main page instead of login page
      router.push('/');
    }
  };

  // Filtered lists
  const filteredBrands = Object.keys(carData).filter((b) =>
    b.toLowerCase().includes(brandInput.toLowerCase())
  );
  const filteredModels =
    brand && carData[brand]
      ? Object.keys(carData[brand].models).filter((m) =>
          m.toLowerCase().includes(modelInput.toLowerCase())
        )
      : [];
  const filteredTrims =
    brand && model && carData[brand]?.models[model]
      ? carData[brand].models[model].filter((t) =>
          t.toLowerCase().includes(trimInput.toLowerCase())
        )
      : [];

  // Helper for blur: close dropdown only if click is outside
  const handleBlur = (ref: React.RefObject<HTMLDivElement>, setShow: (v: boolean) => void) => (e: React.FocusEvent) => {
    setTimeout(() => {
      if (ref.current && !ref.current.contains(document.activeElement)) {
        setShow(false);
      }
    }, 0);
  };

  const handleCalculatePrice = async () => {
    if (!brand || !model || !trim || !year || !mileage) {
      setError('Please fill in all fields');
      return;
    }

    setPredictionLoading(true);
    setError(null);

    try {
      const carPredictionData = {
        brand,
        model,
        trim,
        year: parseInt(year),
        mileage: parseInt(mileage)
      };

      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(carPredictionData),
      });

      const data: PredictionResponse = await response.json();
      
      if (data.success) {
        setPrediction(data);
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setPredictionLoading(false);
    }
  };

  const resetForm = () => {
    setBrand("");
    setModel("");
    setTrim("");
    setYear("");
    setMileage("");
    setBrandInput("");
    setModelInput("");
    setTrimInput("");
    setPrediction(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Show results if we have a prediction
  if (prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              AutoWorth - Price Result
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.username}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-green-600 mb-2">Price Prediction Complete!</h2>
              <p className="text-gray-600">Here's what your car is worth:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg text-white">
                <h3 className="text-xl font-semibold mb-2">Predicted Price</h3>
                <p className="text-4xl font-bold">
                  ${prediction.predicted_price.toLocaleString()}
                </p>
                {prediction.using_fallback && (
                  <p className="text-sm mt-2 opacity-90">
                    Using enhanced fallback model
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Details</h3>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-medium">Year:</span> {prediction.car_details.year}</p>
                  <p><span className="font-medium">Brand:</span> {prediction.car_details.brand}</p>
                  <p><span className="font-medium">Model:</span> {prediction.car_details.model}</p>
                  <p><span className="font-medium">Trim:</span> {prediction.car_details.trim}</p>
                  <p><span className="font-medium">Mileage:</span> {prediction.car_details.mileage.toLocaleString()} miles</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetForm}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Calculate Another Price
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Print Results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main prediction form
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/home-bg.png')",
      }}
    >
      <div className="bg-white bg-opacity-95 rounded-lg shadow-lg p-8 w-full max-w-2xl flex flex-col space-y-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Car Price Calculator</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.username}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Car Brand Dropdown */}
        <div ref={brandDropdownRef} tabIndex={-1} onBlur={handleBlur(brandDropdownRef, setShowBrandDropdown)}>
          <input
            type="text"
            placeholder="Car brand..."
            value={brandInput}
            onFocus={() => setShowBrandDropdown(true)}
            onChange={(e) => {
              setBrandInput(e.target.value);
              setBrand("");
              setModel("");
              setTrim("");
              setModelInput("");
              setTrimInput("");
              setShowBrandDropdown(true);
            }}
            className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {showBrandDropdown && brandInput && (
            <ul className="border border-gray-300 rounded-md bg-white mt-1 max-h-40 overflow-y-auto">
              {filteredBrands.length === 0 && (
                <li className="px-3 py-2 text-gray-400">No brands found</li>
              )}
              {filteredBrands.map((b) => (
                <li
                  key={b}
                  className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                  onMouseDown={() => {
                    setBrand(b);
                    setBrandInput(b);
                    setModel("");
                    setTrim("");
                    setModelInput("");
                    setTrimInput("");
                    setShowBrandDropdown(false);
                  }}
                >
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Car Model Dropdown */}
        <div ref={modelDropdownRef} tabIndex={-1} onBlur={handleBlur(modelDropdownRef, setShowModelDropdown)}>
          <input
            type="text"
            placeholder="Car model..."
            value={modelInput}
            onFocus={() => setShowModelDropdown(true)}
            onChange={(e) => {
              setModelInput(e.target.value);
              setModel("");
              setTrim("");
              setTrimInput("");
              setShowModelDropdown(true);
            }}
            disabled={!brand}
            className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
          />
          {brand && showModelDropdown && modelInput && (
            <ul className="border border-gray-300 rounded-md bg-white mt-1 max-h-40 overflow-y-auto">
              {filteredModels.length === 0 && (
                <li className="px-3 py-2 text-gray-400">No models found</li>
              )}
              {filteredModels.map((m) => (
                <li
                  key={m}
                  className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                  onMouseDown={() => {
                    setModel(m);
                    setModelInput(m);
                    setTrim("");
                    setTrimInput("");
                    setShowModelDropdown(false);
                  }}
                >
                  {m}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Car Trim Dropdown */}
        <div ref={trimDropdownRef} tabIndex={-1} onBlur={handleBlur(trimDropdownRef, setShowTrimDropdown)}>
          <input
            type="text"
            placeholder="Car Trim..."
            value={trimInput}
            onFocus={() => setShowTrimDropdown(true)}
            onChange={(e) => {
              setTrimInput(e.target.value);
              setTrim("");
              setShowTrimDropdown(true);
            }}
            disabled={!model}
            className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
          />
          {model && showTrimDropdown && trimInput && (
            <ul className="border border-gray-300 rounded-md bg-white mt-1 max-h-40 overflow-y-auto">
              {filteredTrims.length === 0 && (
                <li className="px-3 py-2 text-gray-400">No trims found</li>
              )}
              {filteredTrims.map((t) => (
                <li
                  key={t}
                  className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                  onMouseDown={() => {
                    setTrim(t);
                    setTrimInput(t);
                    setShowTrimDropdown(false);
                  }}
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Year and Mileage */}
        <input
          type="number"
          placeholder="Year..."
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="1990"
          max={new Date().getFullYear()}
          className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <input
          type="number"
          placeholder="Mileage..."
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          min="0"
          className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleCalculatePrice}
          disabled={predictionLoading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow text-sm font-medium text-white ${
            predictionLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {predictionLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Calculating Best Price...
            </div>
          ) : (
            'Calculate Best Price'
          )}
        </button>
      </div>
    </div>
  );
};

export default PredictPage;
