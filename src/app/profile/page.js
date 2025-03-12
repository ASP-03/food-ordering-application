'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/dist/server/api-utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link';

export default function profilePage() {
    const session = useSession()
    const [userName, setUserName] = useState('')
    const [image, setImage] = useState('')
    const [phone, setPhone] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [pinCode, setPinCode] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const {status} = session

    useEffect(() => {
        if (status === 'authenticated') {
            setUserName(session.data.user.name)
            setImage(session.data.user.image)
            fetch('/api/profile').then(response => {
                response.json().then(data => {
                    setPhone(data.phone)
                    setStreetAddress(data.streetAddress)
                    setCity(data.city)
                    setPinCode(data.pinCode)
                    setCountry(data.country)
                    setIsAdmin(data.admin)
                })
            })

        }
    }, [session, status])

    async function handleProfileUpdate(ev) {
        ev.preventDefault()
        const savePromise = new Promise(async (resolve, rejects) => {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name:userName, image, streetAddress, phone, city, pinCode, country
                })
            })
            if(response.ok) {
                resolve()
            } else {
                rejects()
            }
        })

        await toast.promise(savePromise, {
            loading: 'Saving...',
            success: 'Profile Saved!',
            error: 'Error',
        })
    }

    async function handleFileChange(ev) {
        const files = ev.target.files;
        if (files?.length === 1) {
            const data = new FormData()
            data.append('file', files[0])
    
            const uploadPromise = new Promise(async (resolve, reject) => {
                try {
                    const controller = new AbortController(); // Abort request on timeout
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: data,
                        signal: controller.signal, // Attach abort controller
                    });
    
                    clearTimeout(timeoutId); // Clear timeout if request succeeds
    
                    if (!response.ok) {
                        reject(new Error('Upload failed: Server responded with error'))
                        return;
                    }
    
                    const result = await response.json();
    
                    if (!result.url) {
                        reject(new Error('Invalid response: No image URL returned'))
                        return;
                    }
    
                    setImage(result.url);
                    resolve(); // Only resolves when upload is 100% successful
                } catch (error) {
                    if (error.name === 'AbortError') {
                        reject(new Error('Upload timeout: Server took too long to respond'))
                    } else {
                        reject(error); // Ensure all errors cause rejection
                    }
                }
            })
    
            await toast.promise(uploadPromise, {
                loading: 'Uploading...',
                success: 'Uploaded!',
                error: (err) => err.message || 'Upload Unsuccessful', // Shows the actual error message
            })
        }
    }
    
    
    
    

    if(status === 'loading') {
        return 'Loading...'
    }

    if(status === 'unauthenticated') {
        return redirect('/login')
    }

    return (
        <section className='mt-8'>
            <div className='flex gap-2 tabs'>
                <Link href={'/profile'}>Profile</Link>
                {isAdmin && (
                    <>
                       <Link href={'/categories'}>Categories</Link>
                       <Link href={'/menu-items'}>Menu Items</Link>
                       <Link href={'/users'}>Users</Link>
                    </>
                )}
            </div>
            <h1 className='mb-4 text-center text-red-600 text-4xl'>
                Profile
            </h1>
            <div className='max-w-md mx-auto'>
                <div className='flex gap-4'>
                    <div>
                        <div className='p-2 rounded-lg relative max-w-[120px]'>
                            {image && (
                                <Image className='rounded-lg w-full h-full mb-1' src={image || '/default-avatar.png'}
                                    width={250} height={250} alt={'avatar'} />
                            )}
                            <label>
                                <input type='file' className='hidden' onChange={handleFileChange} />
                                <span className='block border border-gray-300 rounded-lg p-2 text-center cursor-pointer'>Edit</span>
                            </label>
                        </div>
                    </div>
                    <form className='grow' onSubmit={handleProfileUpdate}>
                        <label>First and last name</label>
                        <input 
                            type='text' placeholder='First and last name' 
                            value={userName} onChange={ev => setUserName(ev.target.value)} />
                        <label>Email</label>    
                        <input type='email' disabled={true} value={session.data.user.email} />
                        <label>Phone</label>
                        <input 
                            type='tel' placeholder='Phone' 
                            value={phone} onChange={ev => setPhone(ev.target.value)}/>
                        <label>Street Address</label>    
                        <input 
                            type='text' placeholder='Street Address'
                            value={streetAddress} onChange={ev => setStreetAddress(ev.target.value)}/>
                        <div className='flex gap-2'>
                            <div>
                            <label>City</label>
                             <input
                                type='text' placeholder='City'
                                value={city} onChange={ev => setCity(ev.target.value)} />
                            </div>
                            <div>
                            <label>Pin Code</label>   
                             <input
                                type='text' placeholder='Pin Code'
                                value={pinCode} onChange={ev => setPinCode(ev.target.value)} />
                            </div> 
                             
                        </div>
                        <label>Country</label>
                        <input 
                                type='text' placeholder='Country'
                                value={country} onChange={ev => setCountry(ev.target.value)} />
                        <button type='submit'>Save</button>
                    </form>
                </div>
            </div>
        </section>
    )
}
