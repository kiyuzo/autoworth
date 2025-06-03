'use client';

import { useEffect, useState } from "react";
import { PredictionResponse } from "../../api/carPrediction";

const ResultPage = () => {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedResult = localStorage.getItem('predictionResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
    
    // Check dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Listen for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-xl" style={{ color: 'var(--text-secondary)' }}>Loading result...</div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="flex flex-col lg:flex-row w-full max-w-6xl min-h-[60vh] px-10">
        {/* Car Image */}
        <div className="flex-shrink-0 flex items-center justify-center w-full lg:w-1/2 mb-8 lg:mb-0">
          <img 
            src="/car.svg" 
            alt="Car" 
            className="w-72 h-56 object-contain"
          />
        </div>
        
        {/* Car Info */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 lg:pl-12">
          {/* Estimated Price - Top and largest */}
          <div 
            className="text-5xl lg:text-7xl font-bold mb-6 lg:mb-8 text-center lg:text-left"
            style={{ 
              color: isDark ? '#9EDDEF' : '#001233'
            }}
          >
            {formatPrice(result.predicted_price)}
          </div>
          
          {/* Brand | Model | Trim */}
          <div 
            className="text-xl lg:text-2xl mb-3 lg:mb-4 text-center lg:text-left"
            style={{ 
              color: isDark ? '#FFFFFF' : '#023E7D'
            }}
          >
            {result.brand} | {result.model} | {result.trim}
          </div>
          
          {/* Year */}
          <div 
            className="text-lg lg:text-xl mb-2 lg:mb-3 text-center lg:text-left"
            style={{ 
              color: isDark ? '#FFFFFF' : '#023E7D'
            }}
          >
            Year: {result.year}
          </div>
          
          {/* Mileage */}
          <div 
            className="text-lg lg:text-xl text-center lg:text-left"
            style={{ 
              color: isDark ? '#FFFFFF' : '#023E7D'
            }}
          >
            Mileage: {result.mileage.toLocaleString()} km
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
