'use client';
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../components/AppContext";
import { adminInfo } from "../components/AdminInfo";
import Image from "next/image";
import toast from "react-hot-toast";
import Trash from "../components/icons/Trash";

export default function CartPage() {
    const { cartProducts, removeCartProduct } = useContext(CartContext);
    const [address, setAddress] = useState({});
    const { data: profileData } = adminInfo();
    const [showQRCode, setShowQRCode] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.href.includes('canceled=1')) {
            toast.error('Payment failed 😔');
        }
    }, []);

    useEffect(() => {
        if (profileData?.city) {
            const { phone, streetAddress, city, pinCode, country } = profileData;
            setAddress({ phone, streetAddress, city, pinCode, country });
        }
    }, [profileData]);

    function cartProductPrice(product) {
        let price = product.basePrice;
        if (product.selectedSize) price += product.selectedSize.price;
        if (product.selectedExtras) {
            for (const extra of product.selectedExtras) {
                price += extra.price;
            }
        }
        return price;
    }

    let subtotal = cartProducts?.reduce((sum, product) => sum + cartProductPrice(product), 0) || 0;

    function handleAddressChange(propName, value) {
        setAddress((prev) => ({ ...prev, [propName]: value }));
    }

    function proceedToPayment(ev) {
        ev.preventDefault();
        setShowQRCode(true); // Show QR Code for payment
    }

    if (showQRCode) {
        return (
            <div className="flex flex-col items-center justify-center mt-8">
                <h2 className="text-gray-700 font-bold text-xl">Scan to Pay Rs.{subtotal+50}</h2>
                <Image 
                    src="/qr.png" 
                    alt="QR Code for Payment" 
                    width={250} 
                    height={250} 
                    className="mt-4 border-2 border-gray-300 p-2 rounded-lg"
                />
                <button
                    onClick={() => setShowQRCode(false)}
                    className="mt-4 px-4 py-2 max-w-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!cartProducts || cartProducts.length === 0) {
        return (
            <section className="mt-8 text-center">
                <h2 className="text-red-600 font-bold text-5xl py-2 italic">Cart</h2>
                <p className="mt-4 text-gray-500">Your shopping cart is empty 😔</p>
            </section>
        );
    }

    return (
        <section className="mt-8">
            <div className="text-center">
                <h2 className="text-red-600 font-bold text-5xl py-2 italic">Cart</h2>
            </div>
            <div className="mt-8 grid gap-8 grid-cols-2">
                <div>
                    {cartProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-4 mb-4">
                            <div className="flex items-center gap-4">
                                <Image src={product.image} alt={product.name} width={70} height={70} />
                                <div>
                                    <p className="font-semibold">{product.name}</p>
                                    <p className="text-gray-500 text-sm">Size: {product.selectedSize?.name || "Regular"}</p>
                                    {product.selectedExtras?.length > 0 && (
                                        <p className="text-gray-500 text-sm">Extras: {product.selectedExtras.map(e => e.name).join(", ")}</p>
                                    )}
                                </div>
                            </div>
                        <div className="text-right">
                             <p className="font-semibold">Rs.{cartProductPrice(product)}</p>
                            <button
                                onClick={() => removeCartProduct(product)}
                                className="px-2 text-red-500 text-lg hover:text-red-700"
                            >
                            <Trash />
                             </button>
                        </div>

                        </div>
                    ))}
                    <div className="py-2 flex justify-end items-center">
                        <div className="text-gray-500">
                            Subtotal:<br />
                            Delivery:<br />
                            <span className="font-semibold">Total:</span>
                        </div>
                        <div className="font-semibold pl-2 text-right">
                            Rs.{subtotal}<br />
                            Rs.50<br />
                            <span className="font-bold text-lg">Rs.{subtotal + 50}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4 px-1">Checkout</h2>
                    <form onSubmit={proceedToPayment}>
                        <div className="mb-4">
                            <label className="block text-gray-600 px-1 py-1">Phone</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={address.phone || ""}
                                onChange={(e) => handleAddressChange("phone", e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 px-1 py-1">Street Address</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={address.streetAddress || ""}
                                onChange={(e) => handleAddressChange("streetAddress", e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 px-1 py-1">City</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={address.city || ""}
                                onChange={(e) => handleAddressChange("city", e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 px-1 py-1">Pin Code</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={address.pinCode || ""}
                                onChange={(e) => handleAddressChange("pinCode", e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 px-1 py-1">Country</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={address.country || ""}
                                onChange={(e) => handleAddressChange("country", e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-2 rounded-lg mt-16"
                        >
                            Pay Rs.{subtotal + 50}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
