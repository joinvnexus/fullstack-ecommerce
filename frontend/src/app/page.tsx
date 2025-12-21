export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🛒 Ecommerce Project
        </h1>
        <p className="text-gray-600 mb-8">
          Fullstack ecommerce application with Next.js, Express, and MongoDB
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Frontend</h2>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Next.js 14 (App Router)</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>React Hook Form</li>
              <li>Zustand State Management</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Backend</h2>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Express.js with TypeScript</li>
              <li>MongoDB with Mongoose</li>
              <li>JWT Authentication</li>
              <li>Stripe Payments</li>
              <li>RESTful API</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}