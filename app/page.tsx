'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
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

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function Home() {
  const router = useRouter();
  const { dbUser, isGuest } = useAuth();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [model, setModel] = useState<Model | null>(null);
  const [trim, setTrim] = useState<Trim | null>(null);
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");

  const [brandInput, setBrandInput] = useState("");
  const [modelInput, setModelInput] = useState("");
  const [trimInput, setTrimInput] = useState("");

  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [trims, setTrims] = useState<Trim[]>([]);

  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showTrimDropdown, setShowTrimDropdown] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<number | null>(null);
  const [recaptchaRendered, setRecaptchaRendered] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);

  const brandDropdownRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const modelDropdownRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const trimDropdownRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        setRecaptchaLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
      script.async = true;
      script.defer = true;
      
      (window as any).onRecaptchaLoad = () => {
        setRecaptchaLoaded(true);
      };
      
      document.head.appendChild(script);
    };

    loadRecaptcha();

    return () => {
      if ((window as any).onRecaptchaLoad) {
        delete (window as any).onRecaptchaLoad;
      }
    };
  }, []);

  useEffect(() => {
    if (recaptchaLoaded && window.grecaptcha && window.grecaptcha.render && recaptchaRef.current && !recaptchaRendered) {
      try {
        if (recaptchaRef.current) {
          recaptchaRef.current.innerHTML = '';
        }

        const widgetId = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
          callback: (token: string) => {
            setRecaptchaToken(token);
          },
          'expired-callback': () => {
            setRecaptchaToken(null);
          },
          'error-callback': () => {
            setRecaptchaToken(null);
          }
        });
        setRecaptchaWidgetId(widgetId);
        setRecaptchaRendered(true);
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
      }
    }
  }, [recaptchaLoaded, recaptchaRendered]);

  useEffect(() => {
    fetchBrands();
  }, []);

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

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandInput.toLowerCase())
  );
  const filteredModels = models.filter((m) =>
    m.name.toLowerCase().includes(modelInput.toLowerCase())
  );
  const filteredTrims = trims.filter((t) =>
    t.name.toLowerCase().includes(trimInput.toLowerCase())
  );

  const handleBlur = (ref: React.RefObject<HTMLDivElement>, setShow: (v: boolean) => void) => () => {
    setTimeout(() => {
      if (ref.current && !ref.current.contains(document.activeElement)) {
        setShow(false);
      }
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!brand || !model || !trim || year === "" || mileage === "") {
      setError("Please fill in all fields");
      return;
    }

    if (recaptchaLoaded && recaptchaRendered && !recaptchaToken) {
      setError("Please complete the reCAPTCHA verification");
      return;
    }

    const yearNum = parseInt(year);
    const mileageNum = parseInt(mileage);

    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      setError("Please enter a valid year");
      return;
    }

    if (isNaN(mileageNum) || mileageNum < 0) {
      setError("Please enter a valid mileage (cannot be negative)");
      return;
    }

    setIsLoading(true);

    try {
      if (recaptchaLoaded && recaptchaRendered && recaptchaToken) {
        const recaptchaResponse = await fetch('/api/verify-recaptcha', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: recaptchaToken }),
        });

        if (!recaptchaResponse.ok) {
          throw new Error('reCAPTCHA verification failed');
        }
      }

      const predictionData: PredictionRequest = {
        brand: brand.name,
        model: model.name,
        trim: trim.name,
        year: yearNum,
        mileage: mileageNum,
        userId: isGuest ? undefined : dbUser?.user_id
      };

      const result = await predictCarPrice(predictionData);
      
      localStorage.setItem('predictionResult', JSON.stringify(result));
      
      router.push('/result');
    } catch (error) {
      console.error('Prediction error:', error);
      setError("Failed to get price prediction. Please try again.");
      
      if (window.grecaptcha && recaptchaWidgetId !== null) {
        try {
          window.grecaptcha.reset(recaptchaWidgetId);
          setRecaptchaToken(null);
        } catch (resetError) {
          console.error('Error resetting reCAPTCHA:', resetError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-full max-w-7xl px-8 flex items-center gap-16">
        {/* Form Section - Left Side on desktop, full width on mobile */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white bg-opacity-95 rounded-lg shadow-lg p-8 w-full">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Car Brand Dropdown */}
              <div ref={brandDropdownRef} tabIndex={-1} onBlur={handleBlur(brandDropdownRef, setShowBrandDropdown)} className="relative">
                <input
                  type="text"
                  placeholder="Car brand"
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
                  className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {showBrandDropdown && brandInput && (
                  <ul className="border border-gray-300 rounded-md bg-white mt-1 max-h-40 overflow-y-auto z-10 absolute w-full left-0">
                    {filteredBrands.length === 0 && (
                      <li className="px-3 py-2 text-gray-400">No brands found</li>
                    )}
                    {filteredBrands.map((b) => (
                      <li
                        key={b.id}
                        className="px-3 py-2 hover:bg-indigo-100 cursor-pointer text-black"
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
              <div ref={modelDropdownRef} tabIndex={-1} onBlur={handleBlur(modelDropdownRef, setShowModelDropdown)} className="relative">
                <input
                  type="text"
                  placeholder="Car model"
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
                  className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                />
                {brand && showModelDropdown && modelInput && (
                  <ul className="border border-gray-300 rounded-md bg-white mt-1 max-h-40 overflow-y-auto z-10 absolute w-full left-0">
                    {filteredModels.length === 0 && (
                      <li className="px-3 py-2 text-gray-400">No models found</li>
                    )}
                    {filteredModels.map((m) => (
                      <li
                        key={m.id}
                        className="px-3 py-2 hover:bg-indigo-100 cursor-pointer text-black"
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
              <div ref={trimDropdownRef} tabIndex={-1} onBlur={handleBlur(trimDropdownRef, setShowTrimDropdown)} className="relative">
                <input
                  type="text"
                  placeholder="Car Trim"
                  value={trimInput}
                  onFocus={() => setShowTrimDropdown(true)}
                  onChange={(e) => {
                    setTrimInput(e.target.value);
                    setTrim(null);
                    setShowTrimDropdown(true);
                  }}
                  disabled={!model}
                  className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                />
                {model && showTrimDropdown && trimInput && (
                  <ul className="border border-gray-300 rounded-md bg-white mt-1 max-h-40 overflow-y-auto z-10 absolute w-full left-0">
                    {filteredTrims.length === 0 && (
                      <li className="px-3 py-2 text-gray-400">No trims found</li>
                    )}
                    {filteredTrims.map((t) => (
                      <li
                        key={t.id}
                        className="px-3 py-2 hover:bg-indigo-100 cursor-pointer text-black"
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
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1900"
                max={new Date().getFullYear() + 1}
                className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <input
                type="number"
                placeholder="Mileage"
                value={mileage}
                onChange={(e) => {
                  const value = e.target.value;
                  // Prevent negative values from being entered
                  if (value === "" || parseInt(value) >= 0) {
                    setMileage(value);
                  }
                }}
                min="0"
                step="1"
                className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              
              {/* Add reCAPTCHA before submit button - Always show container */}
              <div className="flex justify-center">
                <div ref={recaptchaRef} style={{ minHeight: recaptchaLoaded ? '78px' : '0px' }}></div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading || (recaptchaLoaded && !recaptchaToken)}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#001233' }}
              >
                {isLoading ? 'Calculating...' : "See your car's value"}
              </button>
            </form>
          </div>
        </div>

        {/* Catchline Section - Right Side, hidden on mobile */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center pl-8">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            <span style={{ color: 'var(--text-primary)' }}>
              Accurate car valuation{' '}
            </span>
            <span style={{ color: 'var(--text-accent)' }}>
              instantly
            </span>
          </h1>
          <p 
            className="text-xl font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Fill in your car&apos;s details
          </p>
        </div>
      </div>
    </div>
  );
}