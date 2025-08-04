'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  return (
    <nav className="absolute top-0 left-0 w-full p-6 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-3xl font-bold text-white hover:text-indigo-300 drop-shadow-md">
            WorkFlowX
          </span>
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-sm text-gray-700">Welcome, {user.full_name || user.email}</span>
              <button
                onClick={logout}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`text-sm font-semibold leading-6 ${pathname === '/login' ? 'text-blue-600' : 'text-gray-900'}`}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className={`text-sm font-semibold leading-6 ${pathname === '/register' ? 'text-blue-600' : 'text-gray-900'}`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
