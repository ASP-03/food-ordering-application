'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="flex items-center justify-between p-4 shadow-md bg-white">
      <nav className="flex items-center gap-8 text-gray-500 font-semibold">
        <Link className="text-red-600 font-bold text-2xl" href="/">Rominos Pizza</Link>
        <Link href="/">Home</Link>
        <Link href="/menu">Menu</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>

      <nav className="flex items-center gap-4 text-gray-500 font-semibold">
        {status === 'authenticated' ? (
          <>
            <span className="text-gray-700">Hello, {session.user?.name || session.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-600 rounded-full text-white px-6 py-2 hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="bg-red-600 rounded-full text-white px-6 py-2 hover:bg-red-700 transition">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 hover:underline">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
