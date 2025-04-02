import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    email: {type: String, required: true},
    items: [{
        name: {type: String, required: true},
        image: {type: String, required: true},
        price: {type: Number, required: true},
        quantity: {type: Number, required: true},
        selectedSize: {
            name: String,
            price: Number
        },
        selectedExtras: [{
            name: String,
            price: Number
        }]
    }],
    total: {type: Number, required: true},
    status: {type: String, default: 'pending'},
    address: {
        streetAddress: {type: String, required: true},
        city: {type: String, required: true},
        pinCode: {type: String, required: true},
        country: {type: String, required: true}
    },
    phone: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
}, {
    timestamps: true
});

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema); 