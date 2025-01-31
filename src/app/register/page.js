"use client";
import { useState } from "react";
import Image from "next/image";

export default function RegisterPage() {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    function handleFormSubmit(ev){
        ev.preventDefault();
        fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {'Content-Type': 'application/json'},
        })
    }
    return(
        <section className="mt-8">
            <h1 className="mb-4 text-center text-red-600 text-4xl">
                Welcome!
            </h1>
            <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={ev => setEmail(ev.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)} />
                <button type="submit">Register</button>
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