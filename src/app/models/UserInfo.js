import { Schema } from "mongoose";

const UserInfoSchema = new Schema({
    phone: {type: String},
    streetAddress: {type: String},
    city: {type: String},
    pinCode: {type: String},
    country: {type: String},
    admin: {type: Boolean, default: false},
}, {timestamps: true})

export const UserInfo = models?.UserInfo || model('UserInfo', UserInfoSchema)