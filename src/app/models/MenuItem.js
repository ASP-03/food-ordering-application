import { model, models, Schema } from "mongoose";

const MenuItemSchema = new Schema({
    image: {type: String},
    name: {type: String},
    description: {type: String},
    basePrice: {type: String},

}, {timestamps: true})

export const MenuItem = models?.MenuItem || model('MenuItem', MenuItemSchema)