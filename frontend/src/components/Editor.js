import { Link } from "react-router-dom"

const Editor = () => {
    return (
        <section>
            <h1>Editors Page</h1>
            <br />
            <p>Bu sayfaya erişebilirsin</p>
            <div className="flexGrow">
                <Link to="/">Ana Sayfa</Link>
            </div>
        </section>
    )
}

export default Editor