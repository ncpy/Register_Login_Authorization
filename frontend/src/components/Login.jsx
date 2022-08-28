import { useRef, useState, useEffect } from 'react';
import axios from  "axios"


const Login = () => {
    const userRef = useRef(); // imlecin oto odaklanması için
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current?.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const myaxios = await axios.create({ baseURL: "http://localhost:5000" })
        
        //backend url sine bağlanarak res.send olarak gönserilen veriyi alma
        const veri_al = await myaxios.get('/')
        console.log("res: ",veri_al.data)

        //backend url sine veri gönderme
        const veri_gonder = await myaxios.post('/', { adı:"ali" })
        console.log("res: ",veri_gonder.data)


    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Giriş Yap</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Email:</label>
                <input
                    type="text"
                    id="email"
                    ref={userRef} // for focusing
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />

                <label htmlFor="password">Parola:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Giriş Yap</button>
                
            </form>
            <p>
                Hesabın Yok Mu?<br />
                <span className="line">
                    
                    <a href="#">Kayıt Ol</a>
                </span>
            </p>
        </section>
    )
}

export default Login