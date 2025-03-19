import { useEffect, useState } from "react"

export function AdminInfo(){
    const[data, setData] = useState(false)
        const [loading, setLoading] = useState(true)
    
        useEffect(() => {
            setLoading(false)
            fetch('/api/profile').then(response => {
                response.json().then(data => {
                    setData(data)
                    setLoading(false)
                })
            }) 
        }, [])

        return {loading, data}
}