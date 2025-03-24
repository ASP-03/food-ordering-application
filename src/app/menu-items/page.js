'use client';
import UserTabs from "../components/layout/UserTabs";
import { adminInfo } from "../components/AdminInfo";
import { useEffect, useState } from "react";
import Link from "next/link";
import Right from "../components/icons/Right";

export default function MenuItemsPage() {

    const [menuItems, setMenuItems] = useState([])
    const { loading, data } = adminInfo()

    useEffect(() => {
        fetch('/api/menu-items')
            .then(res => res.json())
            .then(menuItems => setMenuItems(menuItems))
            .catch(error => console.error("Error fetching menu items:", error))
    }, []);

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
                <Link className="button flex items-center gap-2" href={'/menu-items/new'}>  
                    Create a new menu item
                    <Right />
                </Link>
            </div>
            <div>
                <h2 className="text-sm text-gray-500 mt-8">Edit menu item:</h2>
                {menuItems.length > 0 ? (
                    menuItems.map(item => (
                        <Link key={item._id} href={`/menu-items/edit/${item._id}`} className="block mb-1 text-blue-500 hover:underline">
                            {item.name}
                        </Link>
                    ))
                ) : (
                    <p className="text-gray-400">No menu items available.</p>
                )}
            </div>
        </section>
    )
}