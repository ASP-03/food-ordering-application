'use client';
import UserTabs from "../components/layout/UserTabs";
import { adminInfo } from "../components/adminInfo";
import EditImage from "../components/layout/EditImage";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Right from "../components/icons/Right"

export default function MenuItemsPage() {

    const {loading, data} = adminInfo()

    if (loading) {
        return 'Loading user info...'
    }

    if(!data.admin) {
        return 'Not an admin.'
    }


    return (
        <section className="mt-8 max-w-md mx-auto">
            <UserTabs isAdmin={true} />
            <div className="mt-8">
                <Link 
                    className="button"
                    href={'/menu-items/new'}>
                    Create a new menu item
                    <Right />
                </Link>
            </div>
        </section>
    )
}