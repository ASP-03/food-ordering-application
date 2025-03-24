'use client';
import UserTabs from "../components/layout/UserTabs";
import { adminInfo } from "../components/AdminInfo";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CategoriesPage() {

    const [categoryName, setCategoryName] = useState('')
    const [categories, setCategories] = useState([])
    const {loading:profileLoading, data:profileData} = adminInfo()
    const [editCategory, setEditCategory] = useState(null)

    useEffect(() => {
         fetchCategories()
    }, [])

    function fetchCategories() {
        fetch('/api/categories').then(res => {
            res.json().then(categories => {
                setCategories(categories)
            })
        })
    }

    async function handleCategorySubmit(ev) {
        ev.preventDefault()
        const creationPromise = new Promise(async (resolve, reject) => {
            const data = {name:categoryName}
            if (editCategory) {
                data._id = editCategory._id
            }  
            const response = await fetch('/api/categories', {
                method: editCategory ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
           })
           setCategoryName('')
           fetchCategories()
           setEditCategory(null)
           
           if (response.ok) 
            resolve()
           else
            reject()
        })

        await toast.promise(creationPromise, {
            loading: editCategory 
                   ? 'Updating Category...' 
                   : 'Creating your new category...',
            success: editCategory 
                   ? 'Category updated successfully' 
                   : 'Category created successfully',
            error: 'Error, sorry...',
        })
    }

    if (profileLoading) {
        return 'Loading user info...'
    }

    if (!profileData?.admin) {
        return 'Not an admin'
    }
    
    return(
        <section className="mt-8 max-w-md mx-auto">
            <UserTabs isAdmin={true} /> 
            <form className="mt-8" onSubmit={handleCategorySubmit}>
                <div className="flex gap-2 items-end">
                  <div className="grow">
                    <label>
                        {editCategory ? 'Update Category' : 'New Category name'}
                        {editCategory && (
                            <>: <b>{editCategory.name}</b></>
                        )}
                    </label>
                    <input type='text'
                        value={categoryName}
                        onChange={ev => setCategoryName(ev.target.value)}/>
                  </div>
                  <div className="pb-2">
                    <button className="border border-red-600" type="submit">
                        {editCategory ? 'Update' : 'Create'}
                    </button>
                  </div>
                </div>
            </form>
            <div>
                <h2 className="mt-4 text-sm text-gray-500">Edit Category:</h2>
                {categories?.length > 0 && categories.map(c => (
                    <button 
                        onClick={() => {
                            setEditCategory(c);
                            setCategoryName(c.name);
                        }} 
                        key={c._id || c.name} 
                        className="bg-gray-200 rounded-xl p-2 px-4 flex gap-1 cursor-pointer mb-1">
                        <span>{c.name}</span>
                    </button>
                ))}
            </div>
        </section>
    )
}