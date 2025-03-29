import { model, models, Schema } from "mongoose";

const CartSchema = new Schema({
    userEmail: {type: String, required: true},
    products: {type: [Object], required: true},
}, {timestamps: true});

export const Cart = models?.Cart || model('Cart', CartSchema); 