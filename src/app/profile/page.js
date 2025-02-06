'use client';
import { useSession } from "next-auth/react"
import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function profilePage() {
    const session = useSession();
    const [userName, setUserName] = useState('');
    const [image, setImage] = useState('');
    const [profileSaved, setProfileSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const {status} = session;

    useEffect(() => {
        if (status === 'authenticated') {
            setUserName(session.data.user.name);
            setImage(session.data.user.image);
        }
    }, [session, status])

    async function handleProfileUpdate(ev) {
        ev.preventDefault();
        setProfileSaved(false);
        setIsSaving(true);
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name:userName}),
        })
        setIsSaving(false);
        if(response.ok){
            setProfileSaved(true);
        }
    }
    async function handleFileChange(ev) {
            const files = ev.target.files;
            if(files?.length === 1) {
                const data = new FormData;
                data.set('file', files[0]);
                const response = await fetch ('/api/upload', {
                    method: 'POST',
                    body: data,
                })
                const link = await response.json();
                setImage(link);
            }
        }

    if(status === 'loading') {
        return 'Loading...'
    }

    if(status === 'unauthenticated') {
        return redirect('/login');
    }

    return (
        <section className="mt-8">
            <h1 className="mb-4 text-center text-red-600 text-4xl">
            Profile
            </h1>
            <div className="max-w-md mx-auto">
                {profileSaved && (
                    <h2 className="text-center bg-green-100 p-4 rounded-lg border border-green-300">Your profile was saved!
                    </h2>
                  )
                }
                {isSaving && (
                    <h2 className="text-center bg-blue-100 p-4 rounded-lg border border-blue-300">Saving...
                    </h2>
                )} 
                <div className="flex gap-4 items-center">
                   <div>
                      <div className="p-2 rounded-lg relative">
                        {image && (
                             <Image className="rounded-lg w-full h-full mb-1" src={image}
                             width={250} height={250} alt={'avatar'} />

                        )}
                        
                         <label>
                         <input type="file" className="hidden" onChange={handleFileChange}/>
                         <span className="block border border-gray-300 rounded-lg p-2 text-center cursor-pointer">Edit</span>
                         </label>
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