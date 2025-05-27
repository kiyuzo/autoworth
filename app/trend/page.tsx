import Link from "next/link";

const otherCars = [
  { name: "Other Car 1", price: "[Price Placeholder]" },
  { name: "Other Car 2", price: "[Price Placeholder]" },
  { name: "Other Car 3", price: "[Price Placeholder]" },
];

const TrendPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundColor: "rgba(143, 217, 251, 0.5)" }}
    >
      {/* Download Button - fixed to bottom left of the screen */}
      <div className="fixed bottom-8 left-8 z-50 flex items-center space-x-2 cursor-pointer hover:opacity-80">
        {/* Download Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
        </svg>
        <span className="text-base font-medium text-black">Download Car Valuation Report</span>
      </div>

      {/* Arrow Button - fixed to bottom right of the screen */}
      <Link
        href="/trend"
        className="fixed bottom-8 right-8 z-50"
        aria-label="Go to trend"
      >
        <span className="text-4xl font-bold text-black">{'>'}</span>
      </Link>

      <div className="flex w-full max-w-6xl gap-0">
        {/* Main Car */}
        <div className="relative bg-[#D8F2FF] rounded-l-xl shadow-lg p-8 flex flex-col items-center w-1/2 min-h-[40vh] mr-8">
          {/* Car Name */}
          <div className="text-3xl font-bold text-gray-800 mb-4 text-center w-full">
            Car Name Placeholder
          </div>
          {/* Car Image Placeholder */}
          <div className="w-56 h-40 bg-gray-300 rounded-lg flex items-center justify-center mb-4">
            <span className="text-gray-500 text-lg">Car Image</span>
          </div>
          {/* Car Price */}
          <div className="text-xl font-semibold text-gray-700 text-center w-full">
            Rp. <span className="font-mono text-4xl text-gray-900">[Price Placeholder]</span>
          </div>
        </div>

        {/* Vertical Line Separator */}
        <div className="flex flex-col items-center justify-center mx-2">
          <div className="h-full w-0.5 bg-gray-400" style={{ minHeight: "40vh" }} />
        </div>

        {/* Other Cars */}
        <div className="flex flex-col justify-center w-1/2 py-10">
          {otherCars.map((car, idx) => (
            <div key={idx} className="flex flex-col items-center w-full">
              {/* Car Row */}
              <div className="flex items-center w-full px-0 py-4">
                {/* Car Image Placeholder */}
                <div className="w-20 h-14 bg-gray-300 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-gray-500 text-sm">Car Image</span>
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <div className="text-lg font-bold text-gray-800">{car.name}</div>
                  <div className="text-base font-semibold text-gray-700">
                    Rp. <span className="font-mono text-2xl text-gray-900">{car.price}</span>
                  </div>
                </div>
              </div>
              {/* Horizontal Line except after last car */}
              {idx < otherCars.length - 1 && (
                <div className="w-full flex justify-center">
                  <div className="border-t-2 border-gray-400 w-full ml-0" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendPage;