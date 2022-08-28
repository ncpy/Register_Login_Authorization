import { useRef, useState, useEffect } from 'react';
import myaxios from '../api/myaxios';


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

        //daha önce giriş yapılmış email ve şifre
        await myaxios.post('/auth/login', { 
            "email": email,
            "password": pwd
        }).then(response => console.log("başarılı: ",response?.data))
          .catch(err => console.log("hata: ", err.config.data))

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