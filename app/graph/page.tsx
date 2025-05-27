import Link from "next/link";

const GraphPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundColor: "rgba(143, 217, 251, 0.5)" }}
    >
      {/* Arrow Button - fixed to bottom right of the screen */}
      <Link
        href="/trend"
        className="fixed bottom-8 right-8 z-50"
        aria-label="Go to trend"
      >
        <span className="text-4xl font-bold text-black">{'>'}</span>
      </Link>

      <div className="flex w-full max-w-6xl gap-8">
        {/* Main Car */}
        <div className="bg-[#D8F2FF] rounded-xl shadow-lg p-8 flex flex-col items-center w-1/2 min-h-[40vh]">
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

        {/* Graph Placeholder */}
        <div className="bg-[#D8F2FF] rounded-xl shadow-lg p-8 flex items-center justify-center w-1/2 min-h-[40vh]">
          <span className="text-gray-500 text-lg">Graph Placeholder</span>
        </div>
      </div>
    </div>
  );
};

export default GraphPage;