'use client';
import { useSession } from 'next-auth/react'
import { redirect } from 'next/dist/server/api-utils';
import Image from 'next/image';
import { useEffect, useState } from 'react'; 
import Infobox from '../components/layout/Infobox';
import Successbox from '../components/layout/Succesbox';
import toast from 'react-hot-toast';

export default function profilePage() {
    const session = useSession();
    const [userName, setUserName] = useState('');
    const [image, setImage] = useState('');
    const {status} = session;

    useEffect(() => {
        if (status === 'authenticated') {
            setUserName(session.data.user.name);
            setImage(session.data.user.image);
        }
    }, [session, status])

    async function handleProfileUpdate(ev) {
        ev.preventDefault();
        toast('Saving...')
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name:userName, image}),
        })
        if(response.ok){
            toast.success('Profile Saved!')
        }
    }
    async function handleFileChange(ev) {
            const files = ev.target.files;
            if(files?.length === 1) {
                const data = new FormData;
                data.append('file', files[0]);
                toast('Uploading...');
                const response = await fetch ('/api/upload', {
                    method: 'POST',
                    body: data,
                })
                if (response.ok) {
                    toast.success('Uploaded!');
                } else {
                    toast.error('Upload unsuccessfull');
                }
                const result = await response.json();
                setImage(result.url);
            }
        }

    if(status === 'loading') {
        return 'Loading...'
    }

    if(status === 'unauthenticated') {
        return redirect('/login');
    }

    return (
        <section className='mt-8'>
            <h1 className='mb-4 text-center text-red-600 text-4xl'>
            Profile
            </h1>
            <div className='max-w-md mx-auto'>
                <div className='flex gap-4 items-center'>
                   <div>
                      <div className='p-2 rounded-lg relative max-w-[120px]'>
                        {image && (
                             <Image className='rounded-lg w-full h-full mb-1' src={image || '/default-avatar.png'}
                             width={250} height={250} alt={'avatar'} />
                         )}
                        <label>
                         <input type='file' className='hidden' onChange={handleFileChange}/>
                         <span className='block border border-gray-300 rounded-lg p-2 text-center cursor-pointer'>Edit</span>
                         </label>
                      </div>
                   </div>
                   <form className='grow' onSubmit={handleProfileUpdate}>
                      <input type='text' placeholder='First and last name' value={userName} onChange={ev => setUserName(ev.target.value)} />
                      <input type='email' disabled={true} value={session.data.user.email} />
                      <button type='submit'>Save</button>
                   </form>
                </div>

            </div>
        </section>
        

    ) 

}