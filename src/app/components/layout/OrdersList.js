'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No orders found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <div key={order._id} 
                    className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-semibold text-xl mb-1 hover:text-red-600 transition-colors duration-200">
                                Order #{order._id.slice(-6)}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {new Date(order.createdAt).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="bg-gray-50 p-3 rounded-lg transform transition-all duration-200 hover:scale-105">
                                <p className="text-sm text-gray-600">Subtotal: <span className="font-medium">Rs.{order.subtotal}</span></p>
                                <p className="text-sm text-gray-600">Delivery: <span className="font-medium">Rs.{order.deliveryFee}</span></p>
                                <p className="text-lg font-bold text-red-600 mt-1">Total: Rs.{order.total}</p>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 font-medium transform transition-all duration-200 hover:scale-105 hover:bg-green-200">
                                    Payment Confirmed
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3 mt-6">
                        {order.items.map((item, index) => (
                            <div key={index} 
                                className="flex items-center gap-4 py-3 border-b last:border-0 transform transition-all duration-200 hover:bg-gray-50 rounded-lg px-2">
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden group">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover transform transition-all duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-lg hover:text-red-600 transition-colors duration-200">
                                        {item.name}
                                    </p>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>Size: {item.selectedSize?.name || 'Regular'}</p>
                                        {item.selectedExtras?.length > 0 && (
                                            <p>Extras: {item.selectedExtras.map(e => e.name).join(', ')}</p>
                                        )}
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-semibold text-lg transition-all duration-200 hover:text-red-600">
                                    Rs.{item.price * item.quantity}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between text-sm hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                            <span className="text-gray-600">Delivery Address:</span>
                            <span className="font-medium text-right">{order.address.streetAddress}, {order.address.city}, {order.address.pinCode}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 