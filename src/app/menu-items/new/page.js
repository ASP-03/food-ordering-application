import { adminInfo } from "../../components/adminInfo";

export default function NewMenuItemPage() {
    const {loading, data} = adminInfo()

    if (loading) {
        return 'Loading user info...'
    }

    if(!data.admin) {
        return 'Not an admin.'
    }

    return (
        <section className="mt-8">
            <UserTabs isAdmin={true} />
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