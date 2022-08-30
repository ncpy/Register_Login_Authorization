import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useAxiosPrivate from "../hooks/useAxiosPrivate"

const Admin = () => {
    const [detay, setDetay] = useState()

    const axiosPrvt = useAxiosPrivate()

    useEffect(() => {
        (async () => {
            const data = await axiosPrvt.get("/posts/private")
            //console.log("data:    ", data)

        const titles = data.data?.map(x => x.title)
        //console.log("titles: ",titles)
        setDetay(titles)
        })()
    }, [axiosPrvt])

    return (
        <section>
            <h1>Admins Page</h1>
            <br />
            <p>Bu sayfaya erişebilirsin</p>

            {detay?.length
                ?   (
                        <ul>
                            {detay.map((user, i) => 
                                <li key={i}>{user}</li>)}
                        </ul>
                    )
                :   <p>Görüntülenecek detay bulunamadı</p>
                            }

            <div className="flexGrow">
                <Link to="/">Ana Sayfa</Link>
            </div>
        </section>
    )
}

export default Admin