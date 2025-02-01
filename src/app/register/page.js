"use client";
import Link from 'next/link';
import  {useState} from "react";
import Image from "next/image";

export default function RegisterPage() {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[creatingUser, setCreatingUser] = useState(false);
    const[userCreated, setUserCreated] = useState(false);
    const[error, setError] = useState(false);
    async function handleFormSubmit(ev){
        ev.preventDefault();
        setCreatingUser(true);
        setError(false);
        setUserCreated(false);
        const response = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify({email, password}),
                headers: {'Content-Type': 'application/json'},
            })
            if(response.ok) {
                setUserCreated(true);
            }
            else {
                setError(true);
            }
            setCreatingUser(false);
        
  }
    return(
        <section className="mt-8">
            <h1 className="mb-4 text-center text-red-600 text-4xl">
                Welcome!
            </h1>
            {userCreated && (
                <div className="my-4 text-center">
                    Registered!<br /> Now you can{' '}
                    <Link className='underline' href={'/login'}>Login &raquo;</Link>
                </div>
            )}
            {error && (
                <div className="my-4 text-center">
                    An error has occured.<br />
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
                <button className="flex mt-2 justify-center">
                    <Image src={'/google.jpg'} alt={'Google'} width={24} height={24}/> Google
                </button>
                <div className="text-center my-4 text-gray-500 border-t pt-4">
                    Already have an account?{' '}<Link className='underline' href={'/login'}>Login &raquo;</Link>
                </div>
                
            </form>
        </section>

    )
}