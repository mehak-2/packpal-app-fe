import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to PackPal
          </h1>
          <p className="text-gray-600 mb-8">Your personal travel companion</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="w-full inline-block bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-indigo-700"
          >
            Sign In
          </Link>

          <Link
            href="/auth/signup"
            className="w-full inline-block bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-md text-lg font-medium hover:bg-indigo-50"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
