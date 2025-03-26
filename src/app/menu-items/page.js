'use client';
import UserTabs from "../components/layout/UserTabs";
import { useEffect, useState } from "react";
import Link from "next/link";
import Right from "../components/icons/Right";
import { adminInfo } from "../components/AdminInfo";
import Image from "next/image";

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
        <section className="mt-8 max-w-2xl mx-auto text-center">
            <UserTabs isAdmin={true} />
            <div className="mt-8">
                <Link className="button flex items-center gap-2 justify-center mx-auto" href={'/menu-items/new'}>
                    <span>Create a new menu item</span>
                    <Right />
                </Link>
            </div>
            <div className="mt-8 flex flex-col items-center">
                <h2 className="text-sm text-gray-500">Edit menu items:</h2>
                <div className="grid grid-cols-3 gap-2 w-full">
                    {menuItems.length > 0 ? (
                      menuItems.map((item) => (
                    <Link
                    key={item._id}
                    href={'/menu-items/edit/' + item._id}
                    className="bg-gray-200 rounded-lg p-4"
                >
                    <div className="relative">
                        <Image
                            className="rounded-md"
                            src={item.image}
                            alt=""
                            width={200}
                            height={200}
                        />
                    </div>
                    <div className="text-center">{item.name}</div>
                   </Link>
            ))
            ) : (
            <div className="col-span-3 flex items-center justify-center h-20">
                <p className="text-gray-400 text-center">No menu items available.</p>
            </div>
            )}
            </div>
            </div>

        </section>
    )
    
}