'use client';
import { use, useState } from "react";
import Image from "next/image";
import { signIn } from 'next-auth/react';


export default function LoginPage() {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[loginInProgress, setLoginInProgress] = useState(false);

    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setLoginInProgress(true);
        await signIn('credentials', {email, password, callbackUrl:'/'});
        setLoginInProgress(false);
    }
    return(
        <section className="mt-8">
            <h1 className="mb-4 text-center text-red-600 text-4xl">
                Login
            </h1>
            <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
              <input type="email" name="email" placeholder="Email" value={email} disabled={loginInProgress}
                 onChange={ev => setEmail(ev.target.value)} />
              <input type="password" name="password" placeholder="Password" value={password} disabled={loginInProgress} onChange={ev => setPassword(ev.target.value)} />
              <button disabled={loginInProgress} type="submit">Login
              </button>
              <div className="mt-4 text-center text-gray-500">
                    Or Continue with
                </div>
                <button type="button" onClick={() => signIn('google', {callbackUrl:'/'})} 
                   className="flex mt-2 justify-center">
                    <Image src={'/google.jpg'} alt={'Google'} width={24} height={24} /> Google
                </button>
             </form>
        </section>
    )
}