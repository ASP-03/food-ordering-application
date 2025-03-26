'use client';
import { useEffect, useState } from "react";
import UserTabs from "../../../components/layout/UserTabs";
import toast from "react-hot-toast";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { adminInfo } from "../../../components/AdminInfo";
import Left from "../../../components/icons/Left";
import MenuItemForm from "../../../components/layout/MenuItemForm";
import DeleteButton from "../../../components/DeleteButton";

export default function EditMenuItemPage() {
    const { id } = useParams();
    const [menuItem, setMenuItem] = useState(null);
    const [redirectToItems, setRedirectToItems] = useState(false);
    const { loading, data } = adminInfo();

    useEffect(() => {
        fetch(`/api/menu-items`)
            .then(res => res.json())
            .then(items => {
                const item = items.find(i => i._id === id);
                setMenuItem(item);
            });
    }, [id]);

    async function handleFormSubmit(ev, formData) {
        ev.preventDefault();
        formData = { ...formData, _id: id };

        const savingPromise = new Promise(async (resolve, reject) => {
            const response = await fetch('/api/menu-items', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) resolve();
            else reject();
        });

        await toast.promise(savingPromise, {
            loading: 'Saving this tasty item...',
            success: 'Item saved successfully!',
            error: 'Error saving item.',
        });

        setRedirectToItems(true);
    }

    async function handleDeleteClick() {
        const deletePromise = new Promise(async (resolve, reject) => {
            const res = await fetch(`/api/menu-items?_id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) resolve();
            else reject();
        });

        await toast.promise(deletePromise, {
            loading: 'Deleting item...',
            success: 'Item deleted successfully!',
            error: 'Error deleting item.',
        });

        setRedirectToItems(true);
    }

    if (redirectToItems) {
        return redirect('/menu-items');
    }

    if (loading) {
        return 'Loading user info...';
    }

    if (!data.admin) {
        return 'Not an admin.';
    }

    return (
        <section className="mt-8">
            <UserTabs isAdmin={true} />
            <div className="max-w-2xl mx-auto mt-8">
                <Link href={'/menu-items'} className="button">
                    <Left />
                    <span>Show all menu items</span>
                </Link>
            </div>
            <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} />
            <div className="max-w-md mx-auto mt-2">
                <div className="max-w-xs ml-auto pl-4">
                    <DeleteButton 
                        label="Delete this item"
                        onDelete={handleDeleteClick} 
                    />
                </div>
            </div>
        </section>
    );
}
