'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { predictCarPrice, PredictionRequest } from '../api/carPrediction';

interface Brand {
  id: number;
  name: string;
}

interface Model {
  id: number;
  name: string;
  brand_name: string;
}

interface Trim {
  id: number;
  name: string;
  brand_name: string;
  model_name: string;
}

export default function Home() {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [model, setModel] = useState<Model | null>(null);
  const [trim, setTrim] = useState<Trim | null>(null);
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");

  const [brandInput, setBrandInput] = useState("");
  const [modelInput, setModelInput] = useState("");
  const [trimInput, setTrimInput] = useState("");

  // Data from database
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [trims, setTrims] = useState<Trim[]>([]);

  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showTrimDropdown, setShowTrimDropdown] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Refs for blur handling
  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const trimDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    if (brand) {
      fetchModels(brand.name);
    } else {
      setModels([]);
    }
    setModel(null);
    setTrim(null);
    setTrims([]);
  }, [brand]);

  // Fetch trims when model changes
  useEffect(() => {
    if (model && brand) {
      fetchTrims(brand.name, model.name);
    } else {
      setTrims([]);
    }
    setTrim(null);
  }, [model, brand]);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/cars?type=brands');
      if (!response.ok) {
        throw new Error('Failed to fetch brands');
      }
      const data = await response.json();
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]);
    }
  };

  const fetchModels = async (brandName: string) => {
    try {
      const response = await fetch(`/api/cars?type=models&brand=${encodeURIComponent(brandName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data = await response.json();
      setModels(data || []);
    } catch (error) {
      console.error('Error fetching models:', error);
      setModels([]);
    }
  };

  const fetchTrims = async (brandName: string, modelName: string) => {
    try {
      const response = await fetch(`/api/cars?type=trims&brand=${encodeURIComponent(brandName)}&model=${encodeURIComponent(modelName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trims');
      }
      const data = await response.json();
      setTrims(data || []);
    } catch (error) {
      console.error('Error fetching trims:', error);
      setTrims([]);
    }
  };

  // Filtered lists
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandInput.toLowerCase())
  );
  const filteredModels = models.filter((m) =>
    m.name.toLowerCase().includes(modelInput.toLowerCase())
  );
  const filteredTrims = trims.filter((t) =>
    t.name.toLowerCase().includes(trimInput.toLowerCase())
  );

  // Helper for blur: close dropdown only if click is outside
  const handleBlur = (ref: React.RefObject<HTMLDivElement>, setShow: (v: boolean) => void) => (e: React.FocusEvent) => {
    setTimeout(() => {
      if (ref.current && !ref.current.contains(document.activeElement)) {
        setShow(false);
      }
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!brand || !model || !trim || !year || !mileage) {
      setError("Please fill in all fields");
      return;
    }

    const yearNum = parseInt(year);
    const mileageNum = parseInt(mileage);

    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      setError("Please enter a valid year");
      return;
    }

    if (isNaN(mileageNum) || mileageNum < 0) {
      setError("Please enter a valid mileage");
      return;
    }

    setIsLoading(true);

    try {
      const predictionData: PredictionRequest = {
        brand: brand.name,
        model: model.name,
        trim: trim.name,
        year: yearNum,
        mileage: mileageNum
      };

      const result = await predictCarPrice(predictionData);
      
      // Store result in localStorage to pass to result page
      localStorage.setItem('predictionResult', JSON.stringify(result));
      
      // Navigate to result page
      router.push('/result');
    } catch (error) {
      console.error('Prediction error:', error);
      setError("Failed to get price prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/home-bg.png')",
      }}
    >
      <div className="bg-white bg-opacity-95 rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Car Brand Dropdown */}
          <div ref={brandDropdownRef} tabIndex={-1} onBlur={handleBlur(brandDropdownRef, setShowBrandDropdown)}>
            <input
              type="text"
              placeholder="Car brand..."
              value={brandInput}
              onFocus={() => setShowBrandDropdown(true)}
              onChange={(e) => {
                setBrandInput(e.target.value);
                setBrand(null);
                setModel(null);
                setTrim(null);
                setModelInput("");
                setTrimInput("");
                setShowBrandDropdown(true);
              }}
              className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {showBrandDropdown && brandInput && (
              <ul className="border border-gray-300 rounded-md bg-white mt-1 max-h-40 overflow-y-auto z-10 absolute w-full">
                {filteredBrands.length === 0 && (
                  <li className="px-3 py-2 text-gray-400">No brands found</li>
                )}
                {filteredBrands.map((b) => (
                  <li
                    key={b.id}
                    className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                    onMouseDown={() => {
                      setBrand(b);
                      setBrandInput(b.name);
                      setModel(null);
                      setTrim(null);
                      setModelInput("");
                      setTrimInput("");
                      setShowBrandDropdown(false);
                    }}
                  >
                    {b.name}
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
                setModel(null);
                setTrim(null);
                setTrimInput("");
                setShowModelDropdown(true);
              }}
              disabled={!brand}
              className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
            />
            {brand && showModelDropdown && modelInput && (
              <ul className="border border-gray-300 rounded-md bg-white mt-1 max-h-40 overflow-y-auto z-10 absolute w-full">
                {filteredModels.length === 0 && (
                  <li className="px-3 py-2 text-gray-400">No models found</li>
                )}
                {filteredModels.map((m) => (
                  <li
                    key={m.id}
                    className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                    onMouseDown={() => {
                      setModel(m);
                      setModelInput(m.name);
                      setTrim(null);
                      setTrimInput("");
                      setShowModelDropdown(false);
                    }}
                  >
                    {m.name}
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
                setTrim(null);
                setShowTrimDropdown(true);
              }}
              disabled={!model}
              className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
            />
            {model && showTrimDropdown && trimInput && (
              <ul className="border border-gray-300 rounded-md bg-white mt-1 max-h-40 overflow-y-auto z-10 absolute w-full">
                {filteredTrims.length === 0 && (
                  <li className="px-3 py-2 text-gray-400">No trims found</li>
                )}
                {filteredTrims.map((t) => (
                  <li
                    key={t.id}
                    className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                    onMouseDown={() => {
                      setTrim(t);
                      setTrimInput(t.name);
                      setShowTrimDropdown(false);
                    }}
                  >
                    {t.name}
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
            min="1900"
            max={new Date().getFullYear() + 1}
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
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Calculating...' : 'Calculate Best Price'}
          </button>
        </form>
      </div>
    </div>
  );
}