'use client';
import { useEffect, useState } from "react";
import SectionHeaders from "../../components/layout/SectionHeaders";
import MenuItem from "../../components/menu/MenuItem";
import Image from "next/image";

export default function HomeMenu() {
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/menu-items')
            .then(res => res.json())
            .then(menuItems => {
                setBestSellers(menuItems.slice(0, 6));
                setLoading(false);
            })
            .catch(() => setLoading(false)); // Ensure loading stops even if there's an error
    }, []);

    return (
        <section>
            <div className="absolute left-0 right-0 w-full justify-start">
                <div className="h-48 w-48 absolute -left-12">
                    <Image src={'/salad1.jpg'} width={156} height={304} alt={'salad'} />
                </div>
                <div className="h-48 absolute -top-24 right-0 -z-10">
                    <Image src={'/salad2.jpg'} width={156} height={305} alt={'salad'} />
                </div>
            </div>
            <div className="text-center mb-4 mt-12">
                <SectionHeaders subHeader={'CHECK OUT OUR'} mainHeader={'Best Sellers'} />
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 px-28">
                {loading ? (
                    <p className="text-gray-400 col-span-3 text-center">Loading...</p>
                ) : bestSellers.length > 0 ? (
                    bestSellers.map((item) => <MenuItem key={item._id} {...item} />)
                ) : (
                    <p className="text-gray-400 col-span-3 text-center">No bestsellers available.</p>
                )}
            </div>
        </section>
    );
}
