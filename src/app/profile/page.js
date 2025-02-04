'use client';
import { useSession } from "next-auth/react"
import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function profilePage() {
    const session = useSession();
    const [userName, setUserName] = useState('');
    const {status} = session;

    useEffect(() => {
        if (status === 'authenticated') {
            setUserName(session.data.user.name);
        }
    }, [session, status])

    async function handleProfileUpdate(ev) {
        ev.preventDefault();
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name:userName}),
        })

    }

    if(status === 'loading') {
        return 'Loading...'
    }

    if(status === 'unauthenticated') {
        return redirect('/login');
    }

    const userImage = session.data.user.image;

    return (
        <section className="mt-8">
            <h1 className="mb-4 text-center text-red-600 text-4xl">
            Profile
            </h1>
            <div className="max-w-md mx-auto">
                <div className="flex gap-4 items-center">
                   <div>
                      <div className="bg-gray-300 p-2 rounded-lg relative">
                         <Image className="rounded-lg w-full h-full mb-1" src={userImage}
                         width={50} height={50} alt={'avatar'} />
                         <button type="button">Edit</button>
                      </div>
                   </div>
                   <form className="grow" onSubmit={handleProfileUpdate}>
                      <input type="text" placeholder="First and last name" value={userName} onChange={ev => setUserName(ev.target.value)} />
                      <input type="email" disabled={true} value={session.data.user.email} />
                      <button type="submit">Save</button>
                   </form>
                </div>

            </div>
        </section>
        

    ) 

}