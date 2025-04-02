'use client';
import { useContext, useEffect, useState, useRef } from "react";
import { CartContext } from "../components/AppContext";
import { adminInfo } from "../components/AdminInfo";
import Image from "next/image";
import toast from "react-hot-toast";
import Trash from "../components/icons/Trash";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { cartProducts, removeCartProduct, clearCart, updateCartItem } = useContext(CartContext);
    const [address, setAddress] = useState({ phone: "", streetAddress: "", city: "", pinCode: "", country: "" });
    const { data: profileData } = adminInfo();
    const [showQRCode, setShowQRCode] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");  
    const [isFormValid, setIsFormValid] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
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

    useEffect(() => {
        if (editingItem) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [editingItem]);

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
        
        paymentTimerRef.current = setTimeout(async () => {
            try {
                // Calculate item prices with their extras and sizes
                const formattedItems = groupedCartProducts.map(item => {
                    const itemPrice = cartProductPrice(item);
                    return {
                        name: item.name,
                        image: item.image,
                        price: itemPrice,
                        quantity: item.quantity,
                        selectedSize: item.selectedSize || null,
                        selectedExtras: item.selectedExtras || []
                    };
                });

                const deliveryFee = 50;
                const subtotalAmount = formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const totalAmount = subtotalAmount + deliveryFee;

                // Create order
                const orderData = {
                    items: formattedItems,
                    subtotal: subtotalAmount,
                    deliveryFee: deliveryFee,
                    total: totalAmount,
                    address: {
                        streetAddress: address.streetAddress,
                        city: address.city,
                        pinCode: address.pinCode,
                        country: address.country
                    },
                    phone: address.phone,
                    status: 'confirmed'
                };

                console.log('Sending order data:', orderData);

                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to create order');
                }

                setOrderDetails({
                    subtotal: subtotalAmount,
                    deliveryFee: deliveryFee,
                    total: totalAmount
                });
                setShowQRCode(false);
                setPaymentSuccess(true);
                clearCart();
                toast.success("Payment confirmed! 🎉 Order placed successfully.");
            } catch (error) {
                console.error('Error creating order:', error);
                toast.error(error.message || "Failed to create order. Please try again.");
                setShowQRCode(false);
            }
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

    function handleEditItem(item, index) {
        setEditingItem({ ...item, index });
    }

    function handleUpdateItem(updatedItem) {
        if (editingItem) {
            updateCartItem(editingItem.index, updatedItem);
            setEditingItem(null);
        }
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

    if (paymentSuccess) {
        return (
            <div className="flex flex-col items-center justify-center mt-8 p-8 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h2 className="text-green-600 font-bold text-3xl mb-4 animate-fade-in">Payment Successful! 🎉</h2>
                <p className="text-gray-700 text-lg mb-6">Thank you for your purchase! Your order has been placed successfully.</p>
                <div className="bg-gray-50 p-4 rounded-lg mb-6 w-full max-w-md transform transition-all duration-200 hover:scale-105">
                    <h3 className="font-semibold mb-2">Order Details:</h3>
                    <p className="text-gray-600">Subtotal: Rs.{orderDetails?.subtotal || 0}</p>
                    <p className="text-gray-600">Delivery Fee: Rs.{orderDetails?.deliveryFee || 50}</p>
                    <p className="text-gray-600 font-bold">Total Amount: Rs.{orderDetails?.total || 0}</p>
                    <p className="text-gray-600">Delivery Address: {address.streetAddress}, {address.city}</p>
                    <p className="text-gray-600">Phone: {address.phone}</p>
                </div>
                <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg transform transition-all duration-200 hover:scale-105 hover:bg-red-700 hover:shadow-lg active:scale-95"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    if (showQRCode) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/90 z-50">
                <div className="max-w-md w-full mx-4 p-8 bg-white rounded-xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-gray-700 font-bold text-2xl mb-6 text-center">Scan to Pay Rs.{subtotal + 50}</h2>
                    <div className="bg-white p-4 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 mx-auto w-fit">
                        <Image 
                            src="/qr.png" 
                            alt="QR Code for Payment" 
                            width={250} 
                            height={250} 
                            className="border-2 border-gray-200 p-2 rounded-lg transform transition-all duration-300"
                        />
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-gray-600 mb-2">Please scan the QR code to complete payment</p>
                        <div className="bg-gray-50 p-3 rounded-lg mt-4 transform transition-all duration-200 hover:scale-105">
                            <p className="text-sm text-gray-600">Subtotal: <span className="font-medium">Rs.{subtotal}</span></p>
                            <p className="text-sm text-gray-600">Delivery: <span className="font-medium">Rs.50</span></p>
                            <p className="text-lg font-bold text-red-600 mt-1">Total: Rs.{subtotal + 50}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleGoBack}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg transform transition-all duration-200 hover:scale-105 hover:bg-red-700 hover:shadow-lg active:scale-95"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!cartProducts || cartProducts.length === 0) {
        return (
            <section className="mt-8 text-center p-8 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
                <h2 className="text-red-600 font-bold text-5xl py-2 italic animate-fade-in">Cart</h2>
                <p className="mt-4 text-gray-500 text-lg">Your shopping cart is empty 😔</p>
            </section>
        );
    }

    return (
        <section className="mt-8 max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
                <h2 className="text-red-600 font-bold text-5xl py-2 italic animate-fade-in">Cart</h2>
            </div>
            <div className="mt-8 grid gap-8 grid-cols-1 lg:grid-cols-2">
                <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
                    {groupedCartProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6 last:border-0 transform transition-all duration-200 hover:bg-gray-50 rounded-lg px-2">
                            <div className="flex items-center gap-6">
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md group">
                                    <Image 
                                        src={product.image} 
                                        alt={product.name} 
                                        fill 
                                        className="object-cover transform transition-all duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold text-lg hover:text-red-600 transition-colors duration-200">{product.name}</p>
                                    <p className="text-gray-600 text-sm">Size: {product.selectedSize?.name || "Regular"}</p>
                                    <p className="text-gray-600 text-sm">Extras: {product.selectedExtras?.map(e => e.name).join(", ") || "None"}</p>
                                    <p className="text-gray-600 text-sm">Quantity: {product.quantity}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-lg hover:text-red-600 transition-colors duration-200">Rs.{cartProductPrice(product) * product.quantity}</p>
                                <div className="flex gap-2 justify-end mt-2">
                                    <button
                                        onClick={() => handleEditItem(product, index)}
                                        className="px-2 h-8 w-12 text-blue-500 text-lg hover:text-blue-700 transition-colors duration-200 hover:scale-110 transform"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => removeCartProduct(product)}
                                        className="px-2 h-8 w-12 text-red-500 text-lg hover:text-red-700 transition-colors duration-200 hover:scale-110 transform"
                                    >
                                        <Trash className="h-4"/>
                                    </button>
                                </div>
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
                            <span className="font-bold text-2xl text-red-600 hover:scale-105 transform transition-all duration-200">Rs.{subtotal + 50}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
                    <h2 className="text-xl font-semibold mb-6">Checkout</h2>
                    {error && <p className="text-red-600 mb-4 text-sm bg-red-50 p-3 rounded-lg animate-shake">{error}</p>}
                    <form onSubmit={proceedToPayment}>
                        {Object.keys(address).map((field) => (
                            <div className="mb-4" key={field}>
                                <label className="block text-gray-600 px-1 py-1 capitalize font-medium">{field.replace(/([A-Z])/g, ' $1')}</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:border-red-300"
                                    value={address[field]}
                                    onChange={(e) => handleAddressChange(field, e.target.value)}
                                    placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                                />
                            </div>
                        ))}
                       <button
                            type="submit"
                            className={`w-full py-3 rounded-lg mt-8 text-lg font-medium transform transition-all duration-200 ${
                            isFormValid 
                                ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-105 active:scale-95" 
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            disabled={!isFormValid}>
                            Pay Rs.{subtotal + 50}
                       </button>
                    </form>
                </div>
            </div>

            {/* Edit Item Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold mb-4">Edit Item</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-600 mb-2">Size</label>
                                <select
                                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    value={editingItem.selectedSize?.name || "Regular"}
                                    onChange={(e) => {
                                        const size = editingItem.sizes?.find(s => s.name === e.target.value) || { name: "Regular", price: 0 };
                                        setEditingItem(prev => ({...prev, selectedSize: size}));
                                    }}
                                >
                                    <option value="Regular">Regular</option>
                                    {editingItem.sizes?.map(size => (
                                        <option key={size.name} value={size.name}>{size.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-2">Extras</label>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {editingItem.addToppingsPrice?.map(extra => (
                                        <label key={extra._id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                                            <input
                                                type="checkbox"
                                                checked={editingItem.selectedExtras?.some(e => e._id === extra._id)}
                                                onChange={(e) => {
                                                    const newExtras = e.target.checked
                                                        ? [...(editingItem.selectedExtras || []), extra]
                                                        : (editingItem.selectedExtras || []).filter(e => e._id !== extra._id);
                                                    setEditingItem(prev => ({...prev, selectedExtras: newExtras}));
                                                }}
                                                className="rounded text-red-600 focus:ring-red-500"
                                            />
                                            <span>{extra.name} (+Rs.{extra.price})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleUpdateItem(editingItem)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
                                >
                                    Update Item
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
