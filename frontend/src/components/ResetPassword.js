import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { axios1 } from '../api/myaxios';
import passwordComplexity from "joi-password-complexity"
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from 'react-router-dom';


const ResetPassword = () => {
    const userRef = useRef(); // imlecin oto odaklanması için
    const errRef = useRef();

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [errPwd, setErrPwd] = useState("");
    const [pwdFocus, setPwdFocus] = useState(false);
    
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
    
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    const dispatch = useDispatch()

    const {userId, resetString} = useParams() //linkten al


    useEffect(() => {
        userRef.current?.focus();
    }, [])

    useEffect(() => {
        setValidMatch(pwd !== "" && pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [pwd, matchPwd])


    const handleSubmit = async (e) => {
        e.preventDefault();

        //dispatch(loginStart())
        console.log("useparams: ",userId, resetString)
        await axios1.post('/auth/resetPassword', 
            {
                userId,
                resetString,
                "newPassword": pwd,
            },
            {   headers: { 'Content-Type': 'application/json' },
                withCredentials: true //cookie den refresh token ı görebilmek için
            }
        ).then(response => {   //success
            console.log("res data: ", response)

            setSuccess(true);
            console.log("parola sıfırlandı")

        }).catch(err => {
            console.log(err?.response?.data?.toString() || err?.toString())
            setErrMsg(err?.response?.data?.toString() || err?.toString())
            //dispatch(loginFailure())

            errRef.current.focus();
        })

    }

    const passwordChange = (e) => {
        e.preventDefault()
        const valid = passwordComplexity().required().label("Password").validate(e.target.value)
        
        setPwd(valid.value)
        setErrPwd(valid?.error)
        setValidPwd(!valid.hasOwnProperty("error"))
    }

    const confirmPwdChange = (e) => {
        e.preventDefault()
        //const cp = passwordComplexity().required().valid(Joi.ref("password")) // buna gerek yok sadece match yeterli

        setMatchPwd(e.target.value)
    }

    return (
        <>
            {success
                ?
                    <section>
                        <h1>Parola başarılı bir şekilde değiştirildi!</h1>
                        <p><a href="/login">Giriş Yap</a></p>
                    </section>
                :
                    <section>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                        <h1>Parola Değiştir</h1>
                        <form onSubmit={handleSubmit}>

                            <label htmlFor="password">Parola:
                                <FontAwesomeIcon icon={validPwd ? faCheck : faTimes} className={validPwd ? "valid" : pwd ? "invalid": "hide"} />
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={passwordChange}
                                value={pwd}
                                required
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                            />
                            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                {errPwd?.toString()}
                            </p>

                            <label htmlFor="password">Parola Doğrula:
                                <FontAwesomeIcon icon={validMatch ? faCheck : faTimes} className={validMatch ? "valid" : matchPwd ? "invalid": "hide"} />
                            </label>
                            <input
                                type="password"
                                id="confirm_pwd"
                                onChange={confirmPwdChange}
                                value={matchPwd}
                                required
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                            />
                            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Parolar eşleşmelidir.
                            </p>

                            <button disabled={!validPwd || !validMatch ? true : false}>Parola Değiştir</button>
                            
                        </form>
                        
                    </section>
            }
        </>
        
    )
}

export default ResetPassword