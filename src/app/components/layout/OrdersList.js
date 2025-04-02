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
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-semibold text-lg">Order #{order._id.slice(-6)}</h3>
                            <p className="text-gray-600 text-sm">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-lg">Rs.{order.total}</p>
                            <p className="text-sm text-gray-600">{order.status}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 py-2 border-b last:border-0">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">
                                        Size: {item.selectedSize?.name || 'Regular'}
                                        {item.selectedExtras?.length > 0 && (
                                            <span> • Extras: {item.selectedExtras.map(e => e.name).join(', ')}</span>
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">Rs.{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Delivery Address:</span>
                            <span className="font-medium">{order.address.streetAddress}, {order.address.city}, {order.address.pinCode}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 