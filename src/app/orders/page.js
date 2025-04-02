'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UserTabs from '../components/layout/UserTabs';
import OrdersList from '../components/layout/OrdersList';

export default function OrdersPage() {
    const session = useSession();
    const router = useRouter();
    const { status } = session;
    const [isAdmin, setIsAdmin] = useState(false);
    const [profileFetched, setProfileFetched] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        if (status === 'authenticated') {
            fetch('/api/profile').then(response => {
                response.json().then(data => {
                    setIsAdmin(data.admin);
                    setProfileFetched(true);
                });
            });
        }
    }, [status, router]);

    if (status === 'loading' || !profileFetched) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return (
        <section className="mt-8">
            <UserTabs isAdmin={isAdmin} />
            <div className="max-w-4xl mx-auto mt-8 px-4">
                <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
                <OrdersList />
            </div>
        </section>
    );
} 