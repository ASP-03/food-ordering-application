import mongoose from "mongoose";
import connectDB from "../../../utils/db";
import { Category } from "../../models/Category";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB(); 

    try {
        const { name } = await req.json();
        const categoryDoc = await Category.create({ name });
        return NextResponse.json(categoryDoc, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    await connectDB();

    try {
        const { _id, name } = await req.json();
        await Category.updateOne({ _id }, { name });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    await connectDB();

    try {
        const categories = await Category.find();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();

        const url = new URL(req.url);
        const _id = url.searchParams.get('_id');

        if (!_id) {
            return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
        }

        const deletedCategory = await Category.findByIdAndDelete(_id);

        if (!deletedCategory) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Category deleted" });
    } catch (error) {
        console.error("Delete Category Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}