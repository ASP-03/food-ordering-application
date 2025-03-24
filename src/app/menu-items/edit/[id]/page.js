'use client'
import { useEffect, useState } from "react";
import UserTabs from "../../../components/layout/UserTabs";
import toast from "react-hot-toast";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { adminInfo } from "../../../components/AdminInfo";
import Left from "../../../components/icons/Left";
import EditImage from "../../../components/layout/EditImage";

export default function EditMenuItemPage() {

        const {id} = useParams()
        const [image, setImage] = useState('')
        const [name, setName] = useState('')
        const [description, setDescription] = useState('')
        const [basePrice, setBasePrice] = useState('')
        const [redirectToItems, setRedirectToItems] = useState('')    
        const {loading, data} = adminInfo()

        useEffect(() => {
            fetch('/api/menu-items').then(res => {
                res.json().then(items => {
                    const item = items.find(i => i._id === id)
                    setImage(item.image)
                    setName(item.name)
                    setDescription(item.description)
                    setBasePrice(item.basePrice)
                })
            })
        }, [])
    
        async function handleFormSubmit(ev) {
            ev.preventDefault()
            const data = {image, name, description, basePrice, _id:id}
            const savingPromise = new Promise(async (resolve, reject) => {
                const response = await fetch('/api/menu-items', {
                    method: 'PUT',
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
        
            setRedirectToItems(true)
        }
    
        if (redirectToItems) {
            return redirect('/menu-items')
        }
    
        if (loading) {
            return 'Loading user info...'
        }
    
        if(!data.admin) {
            return 'Not an admin.'
        }
    
        return (
            <section className="mt-8">
                <UserTabs isAdmin={true} />
                <div  className="max-w-md mx-auto mt-8">
                    <Link href={'/menu-items'} className="button">
                        <Left /> 
                        <span>Show all menu items</span>
                    </Link>
                </div>
                <form onSubmit={handleFormSubmit} className="mt-8 max-w-md mx-auto">
                  <div className="grid items-start gap-4" 
                       style={{gridTemplateColumns:'.3fr .7fr'}}>
                    <div>
                        <EditImage link={image} setLink={setImage} /> 
                    </div>
                    <div className="grow">
                        <label>Item name</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={ev => setName(ev.target.value)}
                        />
                        <label>Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={ev => setDescription(ev.target.value)}
                        />
                        <label>Base price</label>
                        <input
                            type="text"
                            value={basePrice}
                            onChange={ev => setBasePrice(ev.target.value)}
                        />
                        <button type="submit">Save</button>
                    </div>
                  </div>
                </form>
            </section>
        )
    
    }
