'use client';
import { useEffect, useState } from "react";
import UserTabs from "../components/layout/UserTabs";
import { adminInfo } from "../components/AdminInfo";

export default function CategoriesPage() {

    const {loading:profileLoading, data:profileData} = adminInfo()

    if (profileLoading) {
        return 'Loading user info...'
    }

    if (!profileData.admin) {
        return 'Not an admin'
    }
    
    return(
        <section className="mt-8 max-w-md mx-auto">
            <UserTabs isAdmin={true} /> 
            <form className="mt-8">
                <label>New Category</label>
                <input type='text'/>
            </form>
        </section>
    )
}