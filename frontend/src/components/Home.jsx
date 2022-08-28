import { Link } from "react-router-dom";

const Home = () => {

    const signout = async () => {
        
    }

    return (
        <section>
            <h1>Home</h1>
            <br />
            <p>Giriş Yaptın!</p>
            <br />
            <Link to="/editor">Editor sayfasına git</Link>
            <br />
            <Link to="/admin">Admin sayfasına git</Link>
            <br />
            <Link to="/lounge">Lounge sayfasına git</Link>
            <br />
            <Link to="/linkpage">Linkler sayfasına git</Link>
            <div className="flexGrow">
                <button onClick={signout}>Çıkış</button>
            </div>
        </section>
    )
}

export default Home;