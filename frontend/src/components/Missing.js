import { Link } from "react-router-dom"

const Missing = () => {
    return (
        <article style={{ padding: "100px" }}>
            <h1>Oops!</h1>
            <p>Sayfa Bulunamadı</p>
            <div className="flexGrow">
                <Link to="/">Ana Sayfayı Ziyaret Et</Link>
            </div>
        </article>
    )
}

export default Missing