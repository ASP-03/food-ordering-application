'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import UserTabs from '../components/layout/UserTabs'
import UserForm from '../components/layout/UserForm'
import OrdersList from '../components/layout/OrdersList'

export default function profilePage() {
    const session = useSession()
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [profileFetched, setProfileFetched] = useState(false)
    const {status} = session

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/profile').then(response => {
                response.json().then(data => {
                    setUser(data)
                    setIsAdmin(data.admin)
                    setProfileFetched(true)
                })
            })
        }
    }, [session, status])

    async function handleProfileUpdate(ev, data) {
        ev.preventDefault()
        const savePromise = new Promise(async (resolve, rejects) => {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
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
                <UserForm user={user} onSave={handleProfileUpdate} />
            </div>
            <div className='max-w-4xl mx-auto mt-8 px-4'>
                <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
                <OrdersList />
            </div>
        </section>
    )
}
