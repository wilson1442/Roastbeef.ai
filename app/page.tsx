import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          🥩 RoastBeef.ai
        </h1>
        <p className="text-2xl text-gray-700 mb-8">
          The fun way to roast websites with AI
        </p>
        <p className="text-lg text-gray-600 mb-12">
          Submit any website URL and watch our AI deliver a hilarious, insightful roast of it.
          Perfect for getting feedback, having fun, or just seeing what AI thinks of your site!
        </p>
        <div className="flex gap-4 justify-center">
          {session ? (
            <>
              <Link
                href="/roast"
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg"
              >
                Start Roasting
              </Link>
              <Link
                href="/dashboard"
                className="bg-white text-primary-600 border-2 border-primary-500 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition-all"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="bg-white text-primary-600 border-2 border-primary-500 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition-all"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mt-20 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="text-4xl mb-4">🪙</div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">Free Tokens</h3>
          <p className="text-gray-600">
            Get 5 free tokens when you sign up, plus 1 token every month!
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">AI-Powered</h3>
          <p className="text-gray-600">
            Our advanced AI analyzes websites and delivers witty, insightful roasts.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">Fast & Fun</h3>
          <p className="text-gray-600">
            Submit a URL and get your roast in seconds. Share with friends!
          </p>
        </div>
      </div>
    </div>
  );
}
