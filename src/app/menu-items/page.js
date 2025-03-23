'use client';
import UserTabs from "../components/layout/UserTabs";
import { adminInfo } from "../components/adminInfo";

export default function MenuItemsPage() {

    const {loading, data} = adminInfo()

    if (loading) {
        return 'Loading user info...'
    }

    if(!data.admin) {
        return 'Not an admin.'
    }


    return (
        <section className="mt-8">
            <UserTabs isAdmin={true} />
        </section>
    )
}