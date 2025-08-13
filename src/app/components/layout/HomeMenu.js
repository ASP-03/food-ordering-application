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
            .catch(() => setLoading(false));
    }, []);

    return (
        <section className="relative">
            <div className="absolute left-0 right-0 w-full justify-start">
                <div className="h-48 w-48 absolute -left-24 -top-12 transform transition-all duration-500 hover:scale-110">
                    <Image src={'/salad1.jpg'} width={156} height={304} alt={'salad'} className="rounded-lg shadow-md opacity-80" />
                </div>
                <div className="h-48 absolute -top-24 -right-24 -z-10 transform transition-all duration-500 hover:scale-110">
                    <Image src={'/salad2.jpg'} width={156} height={305} alt={'salad'} className="rounded-lg shadow-md opacity-80" />
                </div>
            </div>
            <div className="text-center mb-4 mt-12">
                <SectionHeaders 
                    subHeader={'CHECK OUT NOW'} 
                    mainHeader={'Best Sellers'} 
                />
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 px-28">
                {loading ? (
                    <div className="col-span-3 flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    </div>
                ) : bestSellers.length > 0 ? (
                    bestSellers.map((item) => (
                        <div key={item._id} className="transform transition-all duration-300 hover:scale-105">
                            <MenuItem {...item} />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 col-span-3 text-center animate-fade-in">No bestsellers available.</p>
                )}
            </div>
        </section>
    );
}
