'use client';
import { useContext, useEffect, useState, useRef } from "react";
import { CartContext } from "../components/AppContext";
import { adminInfo } from "../components/AdminInfo";
import Image from "next/image";
import toast from "react-hot-toast";
import Trash from "../components/icons/Trash";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { cartProducts, removeCartProduct, clearCart } = useContext(CartContext);
    const [address, setAddress] = useState({ phone: "", streetAddress: "", city: "", pinCode: "", country: "" });
    const { data: profileData } = adminInfo();
    const [showQRCode, setShowQRCode] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");  
    const [isFormValid, setIsFormValid] = useState(false);
    const router = useRouter();
    const paymentTimerRef = useRef(null);

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
        validateAddress();
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

    const groupedCartProducts = Object.values(groupedCart).sort((a, b) => {
        const priceA = cartProductPrice(a) * a.quantity;
        const priceB = cartProductPrice(b) * b.quantity;
        return priceB - priceA; // Sort in descending order (highest price first)
    });

    let subtotal = groupedCartProducts.reduce((sum, product) => sum + cartProductPrice(product) * product.quantity, 0) || 0;

    function handleAddressChange(propName, value) {
        setAddress((prev) => ({ ...prev, [propName]: value }));
    }

    function validateAddress() {
        if (!address.phone || !address.streetAddress || !address.city || !address.pinCode || !address.country) {
            setIsFormValid(false);
        } else {
            setIsFormValid(true);
            setError("");
        }
    }

    function handleGoBack() {
        if (paymentTimerRef.current) {
            clearTimeout(paymentTimerRef.current);
            paymentTimerRef.current = null;
        }
        setShowQRCode(false);
    }

    function proceedToPayment(ev) {
        ev.preventDefault();
        if (!isFormValid) {
            setError("Please fill in all fields before proceeding.");
            return;
        }

        setShowQRCode(true);
        
        paymentTimerRef.current = setTimeout(() => {
            setShowQRCode(false);
            setPaymentSuccess(true);
            clearCart();
            toast.success("Payment confirmed! 🎉 Order placed successfully.");
        }, 5000);
    }

    // Cleanup timer on component unmount
    useEffect(() => {
        return () => {
            if (paymentTimerRef.current) {
                clearTimeout(paymentTimerRef.current);
            }
        };
    }, []);

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

    if (paymentSuccess) {
        return (
            <div className="flex flex-col items-center justify-center mt-8 p-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-green-600 font-bold text-3xl mb-4">Order Successful 🎉</h2>
                <p className="text-gray-700 text-lg mb-6">Thank you for your purchase! Your order has been placed successfully.</p>
                <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    if (showQRCode) {
        return (
            <div className="flex flex-col items-center justify-center mt-8 p-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-gray-700 font-bold text-2xl mb-6">Scan to Pay Rs.{subtotal + 50}</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <Image 
                        src="/qr.png" 
                        alt="QR Code for Payment" 
                        width={250} 
                        height={250} 
                        className="border-2 border-gray-200 p-2 rounded-lg"
                    />
                </div>
                <button
                    onClick={handleGoBack}
                    className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!cartProducts || cartProducts.length === 0) {
        return (
            <section className="mt-8 text-center p-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-red-600 font-bold text-5xl py-2 italic">Cart</h2>
                <p className="mt-4 text-gray-500 text-lg">Your shopping cart is empty 😔</p>
            </section>
        );
    }

    return (
        <section className="mt-8 max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
                <h2 className="text-red-600 font-bold text-5xl py-2 italic">Cart</h2>
            </div>
            <div className="mt-8 grid gap-8 grid-cols-1 lg:grid-cols-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    {groupedCartProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6 last:border-0">
                            <div className="flex items-center gap-6">
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md">
                                    <Image 
                                        src={product.image} 
                                        alt={product.name} 
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{product.name}</p>
                                    <p className="text-gray-600 text-sm">Size: {product.selectedSize?.name || "Regular"}</p>
                                    <p className="text-gray-600 text-sm">Extras: {product.selectedExtras?.map(e => e.name).join(", ") || "None"}</p>
                                    <p className="text-gray-600 text-sm">Quantity: {product.quantity}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-lg">Rs.{cartProductPrice(product) * product.quantity}</p>
                                <button
                                    onClick={() => removeCartProduct(product)}
                                    className="px-2 h-8 w-12 text-red-500 text-lg hover:text-red-700 transition-colors duration-200"
                                >
                                    <Trash className="h-4"/>
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="py-4 flex justify-end items-center border-t border-gray-200">
                        <div className="text-gray-600 text-lg">
                            Subtotal:<br />
                            Delivery:<br />
                            <span className="font-semibold text-xl">Total:</span>
                        </div>
                        <div className="font-semibold pl-4 text-right text-lg">
                            Rs.{subtotal}<br />
                            Rs.50<br />
                            <span className="font-bold text-2xl text-red-600">Rs.{subtotal + 50}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-6">Checkout</h2>
                    {error && <p className="text-red-600 mb-4 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
                    <form onSubmit={proceedToPayment}>
                        {Object.keys(address).map((field) => (
                            <div className="mb-4" key={field}>
                                <label className="block text-gray-600 px-1 py-1 capitalize font-medium">{field.replace(/([A-Z])/g, ' $1')}</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                                    value={address[field]}
                                    onChange={(e) => handleAddressChange(field, e.target.value)}
                                    placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                                />
                            </div>
                        ))}
                       <button
                            type="submit"
                            className={`w-full py-3 rounded-lg mt-8 text-lg font-medium transition-all duration-200 ${
                            isFormValid 
                                ? "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg" 
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            disabled={!isFormValid}>
                            Pay Rs.{subtotal + 50}
                       </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
