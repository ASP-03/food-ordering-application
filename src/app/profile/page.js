'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import UserTabs from '../components/layout/UserTabs'
import EditImage from '../components/layout/EditImage'

export default function profilePage() {
    const session = useSession()
    const router = useRouter()
    const [userName, setUserName] = useState('')
    const [image, setImage] = useState('')
    const [phone, setPhone] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [pinCode, setPinCode] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [profileFetched, setProfileFetched] = useState(false)
    const {status} = session;

    useEffect(() => {
        if (status === 'authenticated') {
            setUserName(session.data.user.name)
            setImage(session.data.user.image)
            fetch('/api/profile').then(response => {
                response.json().then(data => {
                    setPhone(data.phone || '')
                    setStreetAddress(data.streetAddress || '')
                    setCity(data.city || '')
                    setPinCode(data.pinCode || '')
                    setCountry(data.country || '')
                    setIsAdmin(data.admin)
                    setProfileFetched(true)
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
    
    
    if(status === 'loading' || !profileFetched) {
        return 'Loading...'
    }

    if(status === 'unauthenticated') {
        router.push('/login')
        return null
    }

    return (
        <section className='mt-8'>
            <UserTabs isAdmin={isAdmin} />
            <div className='max-w-2xl mx-auto mt-8'>
                <div className='flex gap-4'>
                    <div>
                        <div className='p-2 rounded-lg relative max-w-[120px]'>
                            <EditImage link={image} setLink={setImage} />
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
