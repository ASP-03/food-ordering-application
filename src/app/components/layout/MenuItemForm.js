import { useState } from "react";
import EditImage from "./EditImage";

export default function MenuItemForm({onSubmit, menuItem}) {

    const [image, setImage] = useState(menuItem?.image || '')
    const [name, setName] = useState(menuItem?.name || '')
    const [description, setDescription] = useState(menuItem?.description || '')
    const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '')    

    return (
        <form
            onSubmit={ev => onSubmit(ev, {image, name, description, basePrice})} className="mt-8 max-w-md mx-auto">
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
    )
}