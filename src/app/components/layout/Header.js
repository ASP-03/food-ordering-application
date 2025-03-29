'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useContext } from 'react';
import { CartContext } from '../AppContext';
import ShoppingCart from "../../components/icons/ShoppingCart";

export default function Header(){
  const session = useSession();
  const status = session?.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const {cartProducts} = useContext(CartContext);
  if(userName?.includes(' ')) {
    userName = userName.split(' ')[0];
  }


    return(
        <header className="mt-2 px-4 flex items-center justify-between">
        <nav className="flex items-center gap-8 text-gray-500 font-semibold justify">
           <Link className="text-red-600 font-semibold text-2xl" href={'/'}> Rominos Pizza
           </Link>
          <Link href={'/'}>Home</Link>
          <Link href={'/menu'}>Menu</Link>
          <Link href={'/#about'}>About</Link>
          <Link href={'/#contact'}>Contact</Link>
        </nav>
        <nav className="flex items-center gap-3 text-gray-500 font-semibold">
          {status === 'authenticated' && (
            <>
              <Link href={'/profile'} className='whitespace-nowrap'>
                 Hello, {userName}
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} 
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
          {cartProducts?.length > 0 && (
            <Link 
             href={'/cart'} className="relative px-1">
             <ShoppingCart/>
             <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs py-1 px-1 rounded-full loading-3">
                ({cartProducts.length})
             </span> 
            </Link>
          )}
          
        </nav>
      </header>
    )
}