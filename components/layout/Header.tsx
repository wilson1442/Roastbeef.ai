'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-gradient-to-r from-primary-400 to-secondary-400 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-primary-50 transition-colors">
            🥩 RoastBeef.ai
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/roast"
                  className="text-white hover:text-primary-50 font-medium transition-colors"
                >
                  Roast
                </Link>
                <Link
                  href="/dashboard"
                  className="text-white hover:text-primary-50 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/pricing"
                  className="text-white hover:text-primary-50 font-medium transition-colors"
                >
                  Pricing
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-primary-50 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
