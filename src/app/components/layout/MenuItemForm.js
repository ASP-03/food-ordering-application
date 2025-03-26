import { useEffect, useState } from "react";
import EditImage from "./EditImage";
import MenuItemPriceProps from "./MenuItemPriceProps";

export default function MenuItemForm({ onSubmit, menuItem }) {
    const [image, setImage] = useState(menuItem?.image || null);  // ✅ Fix: Ensure no empty string
    const [name, setName] = useState(menuItem?.name || "");
    const [description, setDescription] = useState(menuItem?.description || "");
    const [basePrice, setBasePrice] = useState(menuItem?.basePrice || "");
    const [sizes, setSizes] = useState(menuItem?.sizes || []);
    const [addToppingsPrice, setAddToppingsPrice] = useState(menuItem?.addToppingsPrice || []);
    const [category, setCategory] = useState(menuItem?.category || '');
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch categories");
                }
                return res.json();
            })
            .then(categories => {
                setCategories(categories);
                setLoadingCategories(false);
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                setError("Failed to load categories.");
                setLoadingCategories(false);
            });
    }, []);

    return (
        <form
            onSubmit={(ev) => onSubmit(ev, { image, name, description, basePrice, sizes, addToppingsPrice, category })}
            className="mt-8 max-w-2xl mx-auto">
            
            <div className="md:grid items-start gap-4" style={{ gridTemplateColumns: ".3fr .7fr" }}>
                <div className="py-2">
                    <EditImage link={image} setLink={setImage} />
                </div>
                <div className="grow">
                    <label className="px-1">Item name</label>
                    <input type="text" value={name} onChange={(ev) => setName(ev.target.value)} />

                    <label className="px-1">Description</label>
                    <input type="text" value={description} onChange={(ev) => setDescription(ev.target.value)} />

                    <label>Category</label>
                    {loadingCategories ? (
                        <p>Loading categories...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <select className="border p-2 rounded-md" value={category} onChange={ev => setCategory(ev.target.value)}>
                            <option value="">Select a category</option> {/* ✅ Added default option */}
                            {categories?.length > 0 &&
                                categories.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                        </select>
                    )}

                    <label className="px-1">Base price</label>
                    <input className="px-1" type="text" value={basePrice} onChange={(ev) => setBasePrice(ev.target.value)} />

                    <MenuItemPriceProps 
                        name="Sizes" 
                        addLabel="Add item size" 
                        props={sizes} 
                        setProps={setSizes} 
                    />
                    <MenuItemPriceProps 
                        name="Add Toppings"
                        addLabel="Add toppings price"
                        props={addToppingsPrice}
                        setProps={setAddToppingsPrice}
                    />                 

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">Save</button>
                </div>
            </div>
        </form>
    );
}
