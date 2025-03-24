'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Header(){
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  if(userName?.includes(' ')) {
    userName = userName.split(' ')[0];
  }


    return(
        <header className="flex items-center justify-between">
        <nav className="flex items-center gap-8 text-gray-500 font-semibold justify">
           <Link className="text-red-600 font-semibold text-2xl" href={'/'}> Rominos Pizza
           </Link>
          <Link href={'/'}>Home</Link>
          <Link href={''}>Menu</Link>
          <Link href={''}>About</Link>
          <Link href={''}>Contact</Link>
        </nav>
        <nav className="flex items-center gap-4 text-gray-500 font-semibold">
          {status === 'authenticated' && (
            <>
              <Link href={'/profile'} className='whitespace-nowrap'>
                 Hello, {userName}
              </Link>
              <button onClick={() => signOut({callbackUrl: '/'})} 
                 className="bg-red-600 rounded-full text-white px-8 py-2">
                 Logout
              </button>
            </>
            
          )}
          {status === 'unauthenticated' && (
            <>
              <Link href={'/login'} className="bg-red-600 rounded-full text-white px-8 py-2">Login
              </Link>
              <Link href={'/register'}>Register
              </Link>
            </>
          )}
          
          
        </nav>
      </header>
    )
}