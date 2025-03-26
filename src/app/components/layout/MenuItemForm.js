import { useEffect, useState } from "react";
import EditImage from "./EditImage";
import MenuItemPriceProps from "./MenuItemPriceProps";

export default function MenuItemForm({ onSubmit, menuItem }) {
    const [image, setImage] = useState(menuItem?.image || "");
    const [name, setName] = useState(menuItem?.name || "");
    const [description, setDescription] = useState(menuItem?.description || "");
    const [basePrice, setBasePrice] = useState(menuItem?.basePrice || "");
    const [sizes, setSizes] = useState(menuItem?.sizes || []);
    const [addToppingsPrice, setAddToppingsPrice] = useState(menuItem?.addToppingsPrice || [])
    const [category, setCategory] = useState(menuItem?.category || '') 
    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetch('/api/categories').then(res => {
            res.json().then(categories => {
                setCategories(categories)
            })
        })
    }, [])

    return (
        <form
            onSubmit={(ev) => onSubmit(ev, { image, name, description, basePrice, sizes, addToppingsPrice, category,})}
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
                    <select className="border p-2 rounded-md" value={category} onChange={ev => setCategory(ev.target.value)}>
                         {categories?.length > 0 &&
                            categories.map((c) => (
                            <option key={c._id} value={c._id}>
                               {c.name}
                            </option>
                            ))}
                    </select>

                    <label className="px-1">Base price</label>
                    <input type="text" value={basePrice} onChange={(ev) => setBasePrice(ev.target.value)} />

                    <MenuItemPriceProps 
                        name={'Sizes'} 
                        addLabel={'Add item size'} 
                        props={sizes} 
                        setProps={setSizes} 
                    />
                    <MenuItemPriceProps 
                        name={'Add Toppings'}
                        addLabel={'Add toppings price'}
                        props={addToppingsPrice}
                        setProps={setAddToppingsPrice}
                    />                 

                    <button type="submit">Save</button>
                </div>
            </div>
        </form>
    );
}
