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

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
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
            <UserTabs isAdmin={false} />
            <div className="max-w-4xl mx-auto mt-8 px-4">
                <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
                <OrdersList />
            </div>
        </section>
    );
} 