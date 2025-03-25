import Trash from "../icons/Trash";
import Plus from "../icons/Plus";

export default function MenuItemPriceProps() {

    const[sizes, setSizes] = useState([])

    function addSize() {
        setSizes(oldSizes => {
            return [...oldSizes, {name: '', price: 0}]
        })
    
    }
    
     function editSize(ev, index, prop){
        const newValue = ev.target.value
        setSizes(prevSizes => {
            const newSizes = [...prevSizes]
            newSizes[index][prop] = newValue
            return newSizes
        })
    }
    
    function removeSize(indexToRemove) {
        setSizes(prev => prev.filter((v, index) => index !== indexToRemove))
    }

    return (
        <div className="bg-gray-200 p-2 rounded-md mb-2">
                            <label className="px-1">Sizes</label>
                            {sizes?.length > 0 && sizes.map((size, index) => (
                            <div key={index} className="flex gap-2">
                                <div>
                                    <label className="px-1">Size name</label>
                                    <input 
                                    type="text" 
                                    placeholder="Size name" 
                                    value={size.name} 
                                    onChange={ev => editSize(ev, index, 'name')}
                                    />
                                </div>
                                <div>
                                    <label>Extra price</label>
                                    <input 
                                    type="text" 
                                    placeholder="Extra price" 
                                    value={size.price} 
                                    onChange={ev => editSize(ev, index, 'price')}
                                    />
                                </div>
                                <div>
                                    <button 
                                        type="button"
                                        onClick={() => removeSize(index)}
                                        className="bg-white h-10 mt-6 px-2">
                                        <Trash />
                                    </button>
                                </div>
                            </div>
                           ))}

                            <button
                                type="button" 
                                onClick={addSize}
                                className="bg-white items-center">
                                <Plus className="w-5 h-5"/>
                                Add item size
                            </button>
                        </div>
    )
}