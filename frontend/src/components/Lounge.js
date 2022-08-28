import { Link } from "react-router-dom"

const Lounge = () => {
    return (
        <section>
            <h1>The Lounge</h1>
            <br />
            <p>Admin veya Editörler bu sayfaya erişebilir</p>
            <div className="flexGrow">
                <Link to="/">Ana Sayfa</Link>
            </div>
        </section>
    )
}

export default Lounge