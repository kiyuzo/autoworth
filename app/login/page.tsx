import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome back
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email address"
                className="appearance-none block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue
              </button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold" style={{ color: "#2F37AF" }}>
              Sign Up
            </Link>
          </div>
          {/* Divider with OR */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-400 font-medium">OR</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-between py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none"
            >
              <span>Continue with Google</span>
              {/* Google Icon */}
              <svg className="h-5 w-5 ml-2" viewBox="0 0 24 24">
                <g>
                  <path fill="#4285F4" d="M21.805 10.023h-9.18v3.955h5.262c-.227 1.18-1.36 3.463-5.262 3.463-3.167 0-5.75-2.62-5.75-5.841s2.583-5.841 5.75-5.841c1.805 0 3.017.77 3.713 1.432l2.54-2.47C17.07 3.71 15.13 2.75 12.625 2.75c-5.02 0-9.09 4.07-9.09 9.09s4.07 9.09 9.09 9.09c5.24 0 8.715-3.68 8.715-8.88 0-.6-.07-1.06-.16-1.53z"/>
                  <path fill="#34A853" d="M3.548 7.548l3.25 2.385c.89-1.78 2.57-2.97 4.577-2.97 1.31 0 2.48.45 3.41 1.34l2.54-2.47C15.07 3.71 13.13 2.75 10.625 2.75c-3.13 0-5.78 1.8-7.077 4.798z"/>
                  <path fill="#FBBC05" d="M12.625 21.25c2.505 0 4.445-.83 5.927-2.26l-2.73-2.23c-.74.5-1.7.8-3.197.8-2.45 0-4.53-1.65-5.27-3.87l-3.23 2.5c1.29 2.97 4.13 5.06 8.5 5.06z"/>
                  <path fill="#EA4335" d="M21.805 10.023h-9.18v3.955h5.262c-.227 1.18-1.36 3.463-5.262 3.463-3.167 0-5.75-2.62-5.75-5.841s2.583-5.841 5.75-5.841c1.805 0 3.017.77 3.713 1.432l2.54-2.47C17.07 3.71 15.13 2.75 12.625 2.75c-5.02 0-9.09 4.07-9.09 9.09s4.07 9.09 9.09 9.09c5.24 0 8.715-3.68 8.715-8.88 0-.6-.07-1.06-.16-1.53z"/>
                </g>
              </svg>
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-between py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none"
            >
              <span>Continue with Apple</span>
              {/* Apple Icon */}
              <svg className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-1.14 0-2.07-.93-2.07-2.07 0-1.14.93-2.07 2.07-2.07 1.14 0 2.07.93 2.07 2.07zm4.13 6.13c-.07-.07-1.44-1.41-3.8-1.41-1.5 0-2.53.63-3.19.63-.67 0-1.7-.62-3.19-.62-2.36 0-3.73 1.34-3.8 1.41C2.18 8.18 1.5 10.09 2.13 12.13c.6 1.97 2.2 4.41 3.97 4.41.7 0 1.23-.44 2.13-.44.9 0 1.37.44 2.13.44 1.77 0 3.37-2.44 3.97-4.41.63-2.04-.05-3.95-1.01-4.57z"/>
              </svg>
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-between py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none"
            >
              <span>Continue with Phone</span>
              {/* Phone Icon */}
              <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm10-10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;