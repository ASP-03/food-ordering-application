import { useState } from "react";
import EditImage from "./EditImage";
import MenuItemPriceProps from "./MenuItemPriceProps";

export default function MenuItemForm({ onSubmit, menuItem }) {
    const [image, setImage] = useState(menuItem?.image || "");
    const [name, setName] = useState(menuItem?.name || "");
    const [description, setDescription] = useState(menuItem?.description || "");
    const [basePrice, setBasePrice] = useState(menuItem?.basePrice || "");
    const [sizes, setSizes] = useState([]);
    const [addToppingsPrice, setAddToppingsPrice] = useState(menuItem?.addToppingsPrice || [])

    return (
        <form
            onSubmit={(ev) => onSubmit(ev, { image, name, description, basePrice, sizes, addToppingsPrice})}
            className="mt-8 max-w-md mx-auto"
        >
            <div className="grid items-start gap-4" style={{ gridTemplateColumns: ".3fr .7fr" }}>
                <div>
                    <EditImage link={image} setLink={setImage} />
                </div>
                <div className="grow">
                    <label className="px-1">Item name</label>
                    <input type="text" value={name} onChange={(ev) => setName(ev.target.value)} />
                    <label className="px-1">Description</label>
                    <input type="text" value={description} onChange={(ev) => setDescription(ev.target.value)} />
                    <label className="px-1">Base price</label>
                    <input type="text" value={basePrice} onChange={(ev) => setBasePrice(ev.target.value)} />

                    <MenuItemPriceProps 
                        name={'Sizes'} 
                        addLabel={'Add item size'} 
                        sizes={sizes} 
                        setSizes={setSizes} 
                    />
                    <MenuItemPriceProps 
                        name={'Add Toppings'}
                        addLabel={'Add toppings price'}
                        sizes={addToppingsPrice}
                        setSizes={setAddToppingsPrice}
                    />                 

                    <button type="submit">Save</button>
                </div>
            </div>
        </form>
    );
}
