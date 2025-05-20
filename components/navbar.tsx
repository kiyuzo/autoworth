import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Dark mode toggle placeholder */}
          <div className="flex items-center w-1/5">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {/* Placeholder for dark mode toggle */}
              <span className="w-6 h-6 inline-block bg-gray-300 rounded-full" />
            </button>
          </div>

          {/* Center - Logo/Brand */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="text-2xl font-extrabold" style={{ color: "#2F37AF" }}>
              AUTOWORTH
            </Link>
          </div>

          {/* Right side - Icons and Account */}
          <div className="flex items-center justify-end w-1/5 space-x-4">
            {/* Graph Icon */}
            <button className="text-gray-500 hover:text-gray-700" aria-label="Graph">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 13l3 3 7-7" />
              </svg>
            </button>
            {/* Reversing Time Icon */}
            <button className="text-gray-500 hover:text-gray-700" aria-label="Reversing Time">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-3-7.7" />
              </svg>
            </button>
            {/* English Flag Icon */}
            <button className="text-gray-500 hover:text-gray-700" aria-label="English">
              <span className="inline-block w-6 h-4 rounded-sm overflow-hidden border border-gray-300">
                {/* Simple UK flag representation */}
                <svg viewBox="0 0 60 40" width="24" height="16">
                  <rect width="60" height="40" fill="#00247d"/>
                  <rect x="25" width="10" height="40" fill="#fff"/>
                  <rect y="15" width="60" height="10" fill="#fff"/>
                  <rect x="27" width="6" height="40" fill="#cf142b"/>
                  <rect y="17" width="60" height="6" fill="#cf142b"/>
                </svg>
              </span>
            </button>
            {/* Account Name Placeholder */}
            <span className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Account Name
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;