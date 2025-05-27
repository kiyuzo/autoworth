'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const PredictsPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  
  // Form data
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [trim, setTrim] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Reset model and trim when brand changes
  useEffect(() => {
    setModel('');
    setTrim('');
  }, [brand]);

  // Reset trim when model changes
  useEffect(() => {
    setTrim('');
  }, [model]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPredicting(true);

    try {
      // Store form data in localStorage for the result page
      const carData = {
        brand: brand || 'Toyota',
        model: model || 'Camry',
        trim: trim || 'LE',
        year: parseInt(year) || 2020,
        mileage: parseInt(mileage) || 50000,
      };
      
      localStorage.setItem('carPredictionData', JSON.stringify(carData));
      
      // Redirect directly to result page
      router.push('/result');
      
    } catch (err) {
      console.error('Error:', err);
      // Still redirect to result page even on error
      router.push('/result');
    } finally {
      setPredicting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const carBrands = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 
    'Nissan', 'Hyundai', 'Kia', 'Volkswagen', 'Mazda', 'Subaru'
  ];

  // Car models by brand
  const carModels = {
    'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Sienna', 'Tacoma', 'Tundra', 'Avalon', 'Venza'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'HR-V', 'Ridgeline', 'Passport', 'Insight', 'Fit'],
    'Ford': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Edge', 'Expedition', 'Ranger', 'Bronco', 'Focus', 'Fusion'],
    'Chevrolet': ['Silverado', 'Equinox', 'Tahoe', 'Malibu', 'Traverse', 'Suburban', 'Camaro', 'Corvette', 'Blazer', 'Impala'],
    'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X1', 'X7', '7 Series', '4 Series', 'Z4', 'i3'],
    'Mercedes': ['C-Class', 'E-Class', 'S-Class', 'GLE', 'GLC', 'A-Class', 'CLA', 'GLS', 'G-Class', 'AMG GT'],
    'Audi': ['A4', 'A6', 'Q5', 'Q7', 'A3', 'Q3', 'A8', 'TT', 'R8', 'e-tron'],
    'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Murano', 'Titan', 'Frontier', 'Armada', 'Leaf', 'Maxima'],
    'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Accent', 'Venue', 'Kona', 'Genesis', 'Ioniq'],
    'Kia': ['Forte', 'Optima', 'Sportage', 'Sorento', 'Telluride', 'Rio', 'Soul', 'Stinger', 'Niro', 'Sedona'],
    'Volkswagen': ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf', 'Beetle', 'Arteon', 'ID.4', 'Touareg', 'CC'],
    'Mazda': ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'CX-3', 'CX-30', 'MX-5', 'CX-50', 'Tribute', 'B-Series'],
    'Subaru': ['Outback', 'Forester', 'Impreza', 'Legacy', 'Ascent', 'Crosstrek', 'WRX', 'BRZ', 'Tribeca', 'Baja']
  };

  // Trim levels by brand (common across most models)
  const carTrims = {
    'Toyota': ['L', 'LE', 'XLE', 'Limited', 'Platinum', 'TRD', 'Hybrid', 'Prime'],
    'Honda': ['LX', 'Sport', 'EX', 'EX-L', 'Touring', 'Type R', 'Hybrid'],
    'Ford': ['S', 'SE', 'SEL', 'Titanium', 'ST', 'RS', 'Raptor', 'King Ranch', 'Platinum'],
    'Chevrolet': ['L', 'LS', 'LT', 'Premier', 'Z71', 'SS', 'ZL1', 'High Country'],
    'BMW': ['sDrive', 'xDrive', 'M Sport', 'Luxury', 'M Performance', 'Alpina'],
    'Mercedes': ['Base', 'Premium', 'Luxury', 'AMG Line', 'AMG', 'Maybach'],
    'Audi': ['Premium', 'Premium Plus', 'Prestige', 'S Line', 'S', 'RS'],
    'Nissan': ['S', 'SV', 'SL', 'Platinum', 'NISMO', 'Pro-4X'],
    'Hyundai': ['SE', 'SEL', 'Limited', 'Ultimate', 'N Line', 'N'],
    'Kia': ['LX', 'S', 'EX', 'SX', 'GT-Line', 'GT'],
    'Volkswagen': ['S', 'SE', 'SEL', 'R-Line', 'R', 'GLI', 'GTI'],
    'Mazda': ['Sport', 'Touring', 'Grand Touring', 'Signature', 'Carbon Edition'],
    'Subaru': ['Base', 'Premium', 'Sport', 'Limited', 'Touring', 'STI', 'Wilderness']
  };

  const currentYear = new Date().getFullYear();
  const availableModels = brand ? carModels[brand] || [] : [];
  const availableTrims = brand ? carTrims[brand] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Car Price Prediction</h1>
          <p className="mt-2 text-gray-600">
            Welcome, {user?.username || 'User'}! Enter your car details below.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <select
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a brand</option>
                {carBrands.map((brandOption) => (
                  <option key={brandOption} value={brandOption}>
                    {brandOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
                disabled={!brand}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {brand ? 'Select a model' : 'Select brand first'}
                </option>
                {availableModels.map((modelOption) => (
                  <option key={modelOption} value={modelOption}>
                    {modelOption}
                  </option>
                ))}
              </select>
              {!brand && (
                <p className="mt-1 text-xs text-gray-500">
                  Please select a brand to see available models
                </p>
              )}
            </div>

            {/* Trim */}
            <div>
              <label htmlFor="trim" className="block text-sm font-medium text-gray-700">
                Trim Level
              </label>
              <select
                id="trim"
                value={trim}
                onChange={(e) => setTrim(e.target.value)}
                required
                disabled={!brand}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {brand ? 'Select a trim level' : 'Select brand first'}
                </option>
                {availableTrims.map((trimOption) => (
                  <option key={trimOption} value={trimOption}>
                    {trimOption}
                  </option>
                ))}
              </select>
              {!brand && (
                <p className="mt-1 text-xs text-gray-500">
                  Please select a brand to see available trim levels
                </p>
              )}
            </div>

            {/* Year - Changed to number input */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                min="1990"
                max={currentYear}
                placeholder={`e.g., ${currentYear - 5}`}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter a year between 1990 and {currentYear}
              </p>
            </div>

            {/* Mileage */}
            <div>
              <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
                Mileage
              </label>
              <input
                type="number"
                id="mileage"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                required
                min="0"
                max="1000000"
                placeholder="e.g., 45000"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the current mileage in miles
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={predicting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {predicting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting Price Prediction...
                </>
              ) : (
                'Get Price Prediction'
              )}
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Our system will analyze your car details and provide an estimated market value.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictsPage;