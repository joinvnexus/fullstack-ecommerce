import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        <h2 className="text-4xl font-semibold text-gray-700 mt-4">Page Not Found</h2>
        <p className="text-xl text-gray-500 mt-4">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}