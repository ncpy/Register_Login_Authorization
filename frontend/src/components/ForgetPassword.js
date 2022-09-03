import { useEffect, useRef, useState } from 'react';
import { axios1 } from '../api/myaxios';


const ForgetPassword = () => {
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');

    const [email, setEmail] = useState("")
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setErrMsg('');
    }, [ email ])

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios1.post('/auth/requestPsswrdReset', 
            {
                "email": email,
                "redirectUrl": "http://localhost:3000/resetPassword"
            },
            {   headers: { 'Content-Type': 'application/json' },
                withCredentials: true //cookie den refresh token ı görebilmek için
            }
        ).then(response => {   //success

            console.log("ress: ", response)
            
            setSuccess(true)

        }).catch(err => {
            console.log(err?.response?.data?.toString() || err?.toString())
            setErrMsg(err?.response?.data?.toString() || err?.toString())
            errRef.current.focus();
        })

    }

    return (
        <>
            {success
                ?
                    <section>
                        <p>Parola sıfırlama linki <strong>{email}</strong> adresinize gönderildi. <br/> <br/>Lütfen mailinizi kontrol ediniz.</p>
                    </section>
                :
                    <section>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                        <h1>Şifre Sıfırlama</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="text"
                                id="email"
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            
                            <button>Sıfırla</button>
                            
                        </form>
                        
                    </section>
            }
        </>
    )
}

export default ForgetPassword