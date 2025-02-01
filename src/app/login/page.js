'use client';
import { use, useState } from "react";
import Image from "next/image";

export default function LoginPage() {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    return(
        <section className="mt-8">
            <h1 className="mb-4 text-center text-red-600 text-4xl">
                Login
            </h1>
            <form className="max-w-xs mx-auto">
              <input type="email" placeholder="Email" value= {email} disabled={false}
                 onChange={ev => setEmail(ev.target.value)} />
              <input type="password" placeholder="Password" value={password} disabled={false} onChange={ev => setPassword(ev.target.value)} />
              <button type="submit">Login</button>
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