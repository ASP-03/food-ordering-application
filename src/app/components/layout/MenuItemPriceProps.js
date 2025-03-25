import Trash from "../icons/Trash";
import Plus from "../icons/Plus";

export default function MenuItemPriceProps({ name, addLabel, sizes, setSizes }) {
    function addProp() {
        setSizes((oldSizes) => [...oldSizes, { name: "", price: 0 }]);
    }

    function editProp(ev, index, prop) {
        const newValue = ev.target.value;
        setSizes((prevSizes) => {
            const newSizes = [...prevSizes];
            newSizes[index][prop] = newValue;
            return newSizes;
        });
    }

    function removeProp(indexToRemove) {
        setSizes((prevSizes) => prevSizes.filter((_, index) => index !== indexToRemove));
    }

    return (
        <div className="bg-gray-200 p-2 rounded-md mb-2">
            <label className="px-1"><b>{name}</b></label>
            {sizes?.length > 0 &&
                sizes.map((size, index) => (
                    <div key={index} className="flex gap-2">
                        <div>
                            <label className="px-1">Name</label>
                            <input
                                type="text"
                                placeholder="Size name"
                                value={size.name}
                                onChange={(ev) => editProp(ev, index, "name")}
                            />
                        </div>
                        <div>
                            <label>Extra price</label>
                            <input
                                type="text"
                                placeholder="Extra price"
                                value={size.price}
                                onChange={(ev) => editProp(ev, index, "price")}
                            />
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => removeProp(index)}
                                className="bg-white h-10 mt-6 px-2"
                            >
                                <Trash />
                            </button>
                        </div>
                    </div>
                ))}

            <button type="button" onClick={addProp} className="bg-white flex items-center gap-2 px-2 py-1">
                <Plus className="w-5 h-5" />
                {addLabel}
            </button>
        </div>
    );
}
