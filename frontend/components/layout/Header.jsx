'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const { user, loading, logout} = useAuth();
  const router = useRouter(); 
  const handleLogout = async () => {
    router.push('/login');
    await logout()
  };
  // Don't show header on auth pages
  if (pathname === '/login' || pathname === '/signup' || pathname === '/onboarding') {
    return null;
  }
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="text-2xl font-bold text-[#EF5350]">
            ClassMatch
          </Link>
          
          <div className="flex items-center gap-6">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            <button onClick={handleLogout}>Logout</button>
            {user ? (
              <Link href="/profile">
                <div className="w-10 h-10 bg-[#EF5350] rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0) ?? ''}
                </div>
              </Link>
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

