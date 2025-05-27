import Link from "next/link";

const ResultPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundColor: "rgba(143, 217, 251, 0.5)" }}
    >
      <div className="bg-[#D8F2FF] rounded-xl shadow-lg p-10 flex w-full max-w-6xl min-h-[60vh]">
        {/* Car Image Placeholder */}
        <div className="flex-shrink-0 flex items-center justify-center w-1/2">
          <div className="w-72 h-56 bg-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-lg">Car Image</span>
          </div>
        </div>
        {/* Car Info */}
        <div className="flex flex-col justify-center w-1/2 pl-12">
          <div className="text-4xl font-bold text-gray-800 mb-6">Car Name Placeholder</div>
          <div className="text-2xl font-semibold text-gray-700">
            Rp. <span className="font-mono text-5xl text-gray-900">[Price Placeholder]</span>
          </div>
        </div>
      </div>
      {/* Arrow Button - fixed to bottom right of the screen */}
      <Link
        href="/trend"
        className="fixed bottom-8 right-8 z-50"
        aria-label="Go to trend"
      >
        <span className="text-4xl font-bold text-black">{'>'}</span>
      </Link>
    </div>
  );
};

export default ResultPage;