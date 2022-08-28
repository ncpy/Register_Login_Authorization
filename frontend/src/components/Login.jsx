import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import myaxios from '../api/myaxios';


const Login = () => {
    const userRef = useRef(); // imlecin oto odaklanması için
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"
    console.log("location: ",location)
    console.log("from: ",from)


    useEffect(() => {
        userRef.current?.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        await myaxios.post('/auth/login', 
            {
                "email": email,
                "password": pwd
            },
            {   headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        ).then(response => {   //success
            console.log("res data accesstoken: ", response?.data?.accessToken)
            console.log("res data roles: ", response?.data?.roles)

            navigate(from, { replace:true })
            console.log("first: ",from)
            console.log("giriş yapıldı")

        }).catch(err => {
            console.log(err?.response?.data?.toString() || err?.toString())
        })

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
                    
                    <a href="/signup">Kayıt Ol</a>
                </span>
            </p>
        </section>
    )
}

export default Login