import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { axios1 } from "../api/myaxios";
import { logoutFailure, logoutStart, logoutSuccess } from "../redux/userRedux";

const Home = () => {

    const myuser = useSelector(state => state.user.currentUser)
    console.log("myuser: ", myuser)
    const dispatch = useDispatch()

    const signout = async () => {

        dispatch(logoutStart())
        await axios1.post("/auth/logout")
            .then(response => {
                dispatch(logoutSuccess())
                console.log("logged out")
            })
            .catch(err => {
                dispatch(logoutFailure())
                console.log(err)
            })
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