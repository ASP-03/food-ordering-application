import {User} from "../../models/User"
import mongoose from "mongoose";

export async function POST(req) {
    const body = await req.json();
    mongoose.connect(process.env.MONGO_URL);

    const pass = body.password;

    if (!pass?.length || pass.length < 5) {
        new Error('Password must contain at least 5 characters');
        return false;
    }

    const notHashpass = pass;
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(notHashpass, salt);

    const createdUser = await User.create(body);
    return Response.json(createdUser);

}