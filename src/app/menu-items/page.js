'use client';
import UserTabs from "../components/layout/UserTabs";
import { adminInfo } from "../components/adminInfo";
import EditImage from "../components/layout/EditImage";
import { useState } from "react";
import toast from "react-hot-toast";

export default function MenuItemsPage() {

    const [image, setImage] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [basePrice, setBasePrice] = useState('')
    const {loading, data} = adminInfo()

    async function handleFormSubmit(ev) {
        ev.preventDefault()
        const data = {image, name, description, basePrice}
        const savingPromise = new Promise(async (resolve, reject) => {
            const response = await fetch('/api/menu-items', {
                method: 'POST',
                body: JSON.stringify(data),
                    headers: {'Content-Type': 'application/json'},

            })
            if (response.ok)
                resolve()
            else
                reject()
        })

        await toast.promise(savingPromise, {
            loading: 'Saving this tast item',
            success: 'Saved',
            error: 'Error'
        })
    }

    if (loading) {
        return 'Loading user info...'
    }

    if(!data.admin) {
        return 'Not an admin.'
    }


    return (
        <div>menu items</div>
    )
}