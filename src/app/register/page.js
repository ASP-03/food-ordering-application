"use client";
import Link from 'next/link';
import  {useState} from "react";
import Image from "next/image";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[creatingUser, setCreatingUser] = useState(false);
    const[error, setError] = useState(false);
    const router = useRouter();

    async function handleFormSubmit(ev){
        ev.preventDefault();
        setCreatingUser(true);
        setError(false);
        
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({email, password}),
                headers: {'Content-Type': 'application/json'},
            });
            
            if(response.ok) {
                // After successful registration, automatically log in the user
                const result = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                });
                
                if (result?.ok) {
                    // First wait a bit for the session to be set up
                    await new Promise(resolve => setTimeout(resolve, 300));
                    // Then navigate to home page
                    window.location.href = '/';
                } else {
                    setError(true);
                }
            } else {
                setError(true);
            }
        } catch (error) {
            setError(true);
        } finally {
            setCreatingUser(false);
        }
    }

    return(
        <section className="mt-8">
            <h1 className="mb-4 text-center text-red-600 text-4xl">
                Welcome!
            </h1>
            {error && (
                <div className="my-4 text-center">
                    An error has occurred.<br />
                    Please try again.
                </div>
            )}
            <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
                <input type="email" placeholder="Email" value={email} disabled={creatingUser}
                 onChange={ev => setEmail(ev.target.value)} />
                <input type="password" placeholder="Password" value={password} disabled={creatingUser} onChange={ev => setPassword(ev.target.value)} />
                <button type="submit" disabled={creatingUser}>Register</button>
                <div className="mt-4 text-center text-gray-500">
                    Or Continue with
                </div>
                <button type="button" onClick={() => signIn('google', {callbackUrl:'/'})} 
                  className="flex mt-2 justify-center">
                    <Image src={'/google.jpg'} alt={'Google'} width={24} height={24}/> Google
                </button>
                <div className="text-center my-4 text-gray-500 border-t pt-4">
                    Already have an account?{' '}<Link className='underline' href={'/login'}>Login &raquo;</Link>
                </div>
            </form>
        </section>
    )
}