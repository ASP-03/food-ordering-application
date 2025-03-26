'use client';
import UserTabs from "../components/layout/UserTabs";
import { adminInfo } from "../components/AdminInfo";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeleteButton from "../components/DeleteButton";

export default function CategoriesPage() {
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const { loading: profileLoading, data: profileData } = adminInfo();
    const [editCategory, setEditCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        fetch('/api/categories').then(res => {
          res.json().then(categories => {
            setCategories(categories);
          });
        });
      }

    async function handleCategorySubmit(ev) {
        ev.preventDefault();
        const creationPromise = new Promise(async (resolve, reject) => {
            const data = { name: categoryName };
            if (editCategory) {
                data._id = editCategory._id;
            }
            const response = await fetch('/api/categories', {
                method: editCategory ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            setCategoryName('');
            fetchCategories();
            setEditCategory(null);

            if (response.ok) 
                resolve();
            else 
                reject();
        });

        await toast.promise(creationPromise, {
            loading: editCategory ? 'Updating Category...' : 'Creating your new category...',
            success: editCategory ? 'Category updated successfully' : 'Category created successfully',
            error: 'Error, sorry...',
        });
    }

    async function handleDeleteClick(_id) {
        const promise = new Promise(async (resolve, reject) => {
          const response = await fetch('/api/categories?_id='+_id, {
            method: 'DELETE',
          });
          if (response.ok) {
            resolve();
          } else {
            reject()
          }
        })

        await toast.promise(promise, {
            loading: "Deleting category...",
            success: "Category deleted successfully!",
            error: "Error deleting category",
        })

        fetchCategories()
    }

    if (profileLoading) {
        return 'Loading user info...';
    }

    if (!profileData.admin) {
        return 'Not an admin';
    }

    return (
        <section className="mt-8 max-w-2xl mx-auto">
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
                        <input
                            type='text'
                            value={categoryName}
                            onChange={(ev) => setCategoryName(ev.target.value)}
                        />
                    </div>
                    <div className="pb-2 flex gap-2">
                        <button className="border border-red-600" type="submit">
                            {editCategory ? 'Update' : 'Create'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => {setEditCategory(null), setCategoryName('')}}> 
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
            <div>
                <h2 className="mt-4 text-sm text-gray-500">Existing Categories:</h2>
                {categories?.length > 0 ? (
                    categories.map((c) => (
                        <div key={c._id || c.name} className="bg-gray-100 rounded-xl p-2 px-4 flex gap-1 mb-1 items-center">
                            <div className="grow">
                                {c.name}
                            </div>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditCategory(c);
                                        setCategoryName(c.name);
                                    }}
                                >
                                    Edit
                                </button>
                                <DeleteButton 
                                    label="Delete" 
                                    onDelete={() => handleDeleteClick(c._id)} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No categories available.</p>
                )}
            </div>
        </section>
    );
}
