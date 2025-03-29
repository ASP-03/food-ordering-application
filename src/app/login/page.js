'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/'); // Redirect if already logged in
        }
    }, [router, status]);

    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setLoginInProgress(true);
    
        try {
            const response = await signIn('credentials', {
                email, 
                password, 
                redirect: false // Prevent automatic navigation
            });
    
            if (!response || response.error) {
                toast.error('Login failed. Check your credentials.');
                setLoginInProgress(false);
                return;
            }
    
            toast.success('Login successful!');
    
            // ✅ Redirect to home and force full page reload
            window.location.href = '/';
    
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            console.error("Login error:", error);
        } finally {
            setLoginInProgress(false);
        }
    }
    

    return (
        <section className="mt-8 flex flex-col items-center">
            <h1 className="mb-4 text-red-600 text-4xl font-bold">
                Login
            </h1>
            <form className="max-w-sm w-full p-6 bg-white shadow-md rounded-lg" onSubmit={handleFormSubmit}>
                <input 
                    type="email" name="email" placeholder="Email"
                    value={email} disabled={loginInProgress}
                    onChange={ev => setEmail(ev.target.value)}
                    className="w-full px-4 py-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <input 
                    type="password" name="password" placeholder="Password"
                    value={password} disabled={loginInProgress}
                    onChange={ev => setPassword(ev.target.value)}
                    className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <button 
                    disabled={loginInProgress} type="submit"
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200"
                >
                    {loginInProgress ? 'Logging in...' : 'Login'}
                </button>
                <div className="mt-4 text-center text-gray-500">
                    Or Continue with
                </div>
                <button 
                    type="button" 
                    onClick={() => signIn('google', { callbackUrl: '/' })} 
                    className="w-full flex items-center justify-center bg-gray-100 py-2 rounded-md mt-2 hover:bg-gray-200 transition duration-200 shadow-md"
                >
                    <Image src={'/google.jpg'} alt={'Google'} width={24} height={24} className="mr-2" />
                    Sign in with Google
                </button>
            </form>
        </section>
    );
}
