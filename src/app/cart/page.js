'use client';
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../components/AppContext";
import { adminInfo } from "../components/AdminInfo";
import Image from "next/image";
import toast from "react-hot-toast";
import Trash from "../components/icons/Trash";

export default function CartPage() {
    const { cartProducts, removeCartProduct } = useContext(CartContext);
    const [address, setAddress] = useState({ phone: "", streetAddress: "", city: "", pinCode: "", country: "" });
    const { data: profileData } = adminInfo();
    const [showQRCode, setShowQRCode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");  // State for validation error
    const [isFormValid, setIsFormValid] = useState(false);  // Tracks if form is valid

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

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 350);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        validateAddress();  // Validate form on every address change
    }, [address]);

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

    const groupedCart = cartProducts.reduce((acc, product) => {
        const key = `${product.name}-${product.selectedSize?.name || "Regular"}-${product.selectedExtras?.map(e => e.name).join(",") || "No Extras"}`;
        if (!acc[key]) {
            acc[key] = { ...product, quantity: 1 };
        } else {
            acc[key].quantity += 1;
        }
        return acc;
    }, {});

    const groupedCartProducts = Object.values(groupedCart);
    let subtotal = groupedCartProducts.reduce((sum, product) => sum + cartProductPrice(product) * product.quantity, 0) || 0;

    function handleAddressChange(propName, value) {
        setAddress((prev) => ({ ...prev, [propName]: value }));
    }

    function validateAddress() {
        if (!address.phone || !address.streetAddress || !address.city || !address.pinCode || !address.country) {
            setIsFormValid(false);
        } else {
            setIsFormValid(true);
            setError("");  // Clear error when form is valid
        }
    }

    function proceedToPayment(ev) {
        ev.preventDefault();
        if (!isFormValid) {
            setError("Please fill in all fields before proceeding.");
            return;
        }
        setShowQRCode(true);
    }

    if (loading) {
        return (
            <section className="mt-8 text-center">
                <h2 className="text-red-600 font-bold text-5xl py-2 italic">Cart</h2>
                <p className="mt-4 text-gray-500">Loading your cart...</p>
                <div className="mt-4 flex justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
                </div>
            </section>
        );
    }

    if (showQRCode) {
        return (
            <div className="flex flex-col items-center justify-center mt-8">
                <h2 className="text-gray-700 font-bold text-xl">Scan to Pay Rs.{subtotal + 50}</h2>
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
                    {groupedCartProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-4 mb-4">
                            <div className="flex items-center gap-4 mb-3">
                                <Image src={product.image} alt={product.name} width={90} height={90} />
                                <div>
                                    <p className="font-semibold">{product.name}</p>
                                    <p className="text-gray-500 text-sm">Size: {product.selectedSize?.name || "Regular"}</p>
                                    <p className="text-gray-500 text-sm">Extras: {product.selectedExtras?.map(e => e.name).join(", ") || "None"}</p>
                                    <p className="text-gray-500 text-sm">Quantity: {product.quantity}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">Rs.{cartProductPrice(product) * product.quantity}</p>
                                <button
                                    onClick={() => removeCartProduct(product)}
                                    className="px-2 h-8 w-12 text-red-500 text-lg hover:text-red-700"
                                >
                                    <Trash className="h-4"/>
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
                    {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
                    <form onSubmit={proceedToPayment}>
                        {Object.keys(address).map((field) => (
                            <div className="mb-4" key={field}>
                                <label className="block text-gray-600 px-1 py-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={address[field]}
                                    onChange={(e) => handleAddressChange(field, e.target.value)}
                                />
                            </div>
                        ))}
                       <button
                            type="submit"
                            className={`w-full py-2 rounded-lg mt-12 ${
                            isFormValid ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
                            }`}
                            disabled={!isFormValid}>
                            Pay Rs.{subtotal + 50}
                       </button>
                       {!isFormValid && (
                           <p className="text-red-600 text-sm mt-2 text-center">
                           Please fill in all of the required fields to proceed with payment.
                           </p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}
