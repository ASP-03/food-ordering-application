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
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <nav className="flex items-center gap-8">
                        <Link className="text-red-600 font-bold text-3xl hover:text-red-700 transition-colors duration-200" href={'/'}>
                            Rominos Pizza
                        </Link>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href={'/'} className="text-gray-600 hover:text-red-600 transition-colors duration-200">Home</Link>
                            <Link href={'/menu'} className="text-gray-600 hover:text-red-600 transition-colors duration-200">Menu</Link>
                            <Link href={'/#about'} className="text-gray-600 hover:text-red-600 transition-colors duration-200">About</Link>
                            <Link href={'/#contact'} className="text-gray-600 hover:text-red-600 transition-colors duration-200">Contact</Link>
                        </div>
                    </nav>
                    <nav className="flex items-center gap-4">
                        {status === 'authenticated' && (
                            <>
                                <Link href={'/profile'} className='text-gray-600 hover:text-red-600 transition-colors duration-200 whitespace-nowrap'>
                                    Hello, {userName?.split('@')[0]}
                                </Link>
                                <button onClick={() => signOut({ callbackUrl: '/' })} 
                                    className="bg-red-600 rounded-full text-white px-6 py-2 hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg">
                                    Logout
                                </button>
                            </>
                        )}
                        {status === 'unauthenticated' && (
                            <>
                                <Link href={'/login'} className="bg-red-600 rounded-full text-white px-6 py-2 hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg">
                                    Login
                                </Link>
                                <Link href={'/register'} className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                                    Register
                                </Link>
                            </>
                        )}
                        {cartProducts?.length > 0 && (
                            <Link 
                                href={'/cart'} 
                                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <ShoppingCart className="w-6 h-6 text-gray-600"/>
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs py-1 px-2 rounded-full shadow-md">
                                    {cartProducts.length}
                                </span> 
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}