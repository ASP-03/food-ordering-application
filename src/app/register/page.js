"use client";
import Link from 'next/link';
import { use, useState } from "react";
import Image from "next/image";

export default function RegisterPage() {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[creatingUser, setCreatingUser] = useState(false);
    const[userCreated, setUserCreated] = useState(false);
    async function handleFormSubmit(ev){
        ev.preventDefault();
        setCreatingUser(true);
        await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {'Content-Type': 'application/json'},
        })
        setCreatingUser(false);
        setUserCreated(true);
    }
    return(
        <section className="mt-8">
            <h1 className="mb-4 text-center text-red-600 text-4xl">
                Welcome!
            </h1>
            {userCreated && (
                <div className="my-4 text-center">
                    Registered! Now you can{' '}
                    <Link className='underline' href={'/login'}>Login &raquo;</Link>
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
                <button className="flex mt-2 justify-center">
                    <Image src={'/google.jpg'} alt={'Google'} width={24} height={24}/> Google
                </button>
                
            </form>
        </section>

    )
}