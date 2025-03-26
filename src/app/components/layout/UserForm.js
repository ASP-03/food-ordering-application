'use client';
import { useState } from "react";
import EditImage from "./EditImage";

export default function UserForm({user, onSave}) {

    const [userName, setUserName] = useState(user?.name || '')
    const [image, setImage] = useState(user?.image || '')
    const [phone, setPhone] = useState(user?.phone || '')
    const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '')
    const [pinCode, setPinCode] = useState(user?.pinCode || '')
    const [city, setCity] = useState(user?.city || '')
    const [country, setCountry] = useState(user?.country || '')

    return (
        <div className='flex gap-4'>
                    <div>
                        <div className='p-2 rounded-lg relative max-w-[120px]'>
                            <EditImage link={image} setLink={setImage} />
                        </div>
                    </div>
                    <form className='grow' onSubmit={() => onSave(ev, {name:userName, image, phone, streetAddress, city, country, pinCode})}>
                        <label>First and last name</label>
                        <input 
                            type='text' placeholder='First and last name' 
                            value={userName} onChange={ev => setUserName(ev.target.value)} />
                        <label>Email</label>    
                        <input type='email' disabled={true} value={user.email} />
                        <label>Phone</label>
                        <input 
                            type='tel' placeholder='Phone' 
                            value={phone} onChange={ev => setPhone(ev.target.value)}/>
                        <label>Street Address</label>    
                        <input 
                            type='text' placeholder='Street Address'
                            value={streetAddress} onChange={ev => setStreetAddress(ev.target.value)}/>
                        <div className='flex gap-2'>
                            <div>
                            <label>City</label>
                             <input
                                type='text' placeholder='City'
                                value={city} onChange={ev => setCity(ev.target.value)} />
                            </div>
                            <div>
                            <label>Pin Code</label>   
                             <input
                                type='text' placeholder='Pin Code'
                                value={pinCode} onChange={ev => setPinCode(ev.target.value)} />
                            </div> 
                             
                        </div>
                        <label>Country</label>
                        <input 
                                type='text' placeholder='Country'
                                value={country} onChange={ev => setCountry(ev.target.value)} />
                        <button type='submit'>Save</button>
                    </form>
                </div>
    )
}