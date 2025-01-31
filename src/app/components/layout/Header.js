import Link from 'next/link';

export default function Header(){
    return(
        <header className="flex items-center justify-between">
        <Link className="text-red-600 font-semibold text-2xl" href={'/'}> Rominos Pizza
        </Link>
        <nav className="flex items-center gap-8 text-gray-500 font-semibold">
          <Link href={'/'}>Home</Link>
          <Link href={''}>Menu</Link>
          <Link href={''}>About</Link>
          <Link href={''}>Contact</Link>
        </nav>
        <nav className="flex items-center gap-4 text-gray-500 font-semibold">
          <Link href={'/login'} className="bg-red-600 rounded-full text-white px-6 py-2">Login
          </Link>
          <Link href={'/register'}>Register
          </Link>
          
        </nav>
      </header>
    )
}