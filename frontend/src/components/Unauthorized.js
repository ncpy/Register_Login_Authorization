import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1); //geldiğin yere git demek

    return (
        <section>
            <h1>Unauthorized</h1>
            <br />
            <p>Bu sayfaya erişemezsin</p>
            <div className="flexGrow">
                <button onClick={goBack}>Geri Git</button>
            </div>
        </section>
    )
}

export default Unauthorized