import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { axios1 } from '../api/myaxios';  //1
import Joi from "joi";
import passwordComplexity from "joi-password-complexity"


const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    //! loading, setLoading  yer,ne production için apollo vb.

    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [errName, setErrName] = useState("");
    const [nameFocus, setNameFocus] = useState(false);
    
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [errEmail, setErrEmail] = useState("");
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [errPwd, setErrPwd] = useState("");
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current?.focus();
    }, [])

    useEffect(() => {
        setValidMatch(pwd !== "" && pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [name, email, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios1.post('/auth/signup', 
                {
                    "username": name,
                    "email": email,
                    "password": pwd,
                    "roles": [2001]
                    //"roles": [{"role":"Editor", "değer": 1984}, {"role":"User", "değer":2001}]

                    //burada roles: (2) [2001, 1984] olacak şekilde yani DB de sadece rakalmalar bulusnun User admin olayı kodlama yaparken kullan o da const olarak
                },
            ).then(response => { //success
                setSuccess(true);
                console.log("res data: ",response.data);
                //console.log("res: ",response);

                //clear state and controlled inputs
                setName('');
                setEmail("")
                setPwd('');
                setMatchPwd('');

            }).catch(error => { //error
                console.log("hata: "+error)
                setErrMsg(error?.response?.data?.toString() || error?.toString())
                
                errRef.current.focus();
            })
    }

    const nameChange = (e) => {
        e.preventDefault()
        const valid = Joi.string().min(3).max(36).required().label("Username").validate(e.target.value)

        setName(valid.value)
        setErrName(valid?.error)
        setValidName(!valid.hasOwnProperty("error"))
    }

    const emailChange = (e) => {
        e.preventDefault()
        const valid = Joi.string()
            .min(5).max(36).required()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', "tr"] } }).label("Email").validate(e.target.value)
            
        setEmail(valid.value)
        setErrEmail(valid?.error)
        setValidEmail(!valid.hasOwnProperty("error"))
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
                        <h1>Lütfen mailinizi doğrulayınız. Sonra Giriş Yapınız!</h1>
                        <p><a href="/login">Giriş Yap</a></p>
                    </section>
                :   
                    <section>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        
                        <h1>Kayıt Ol</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username">
                                Kullanıcı Adı:
                                <FontAwesomeIcon icon={validName ? faCheck : faTimes} className={validName ? "valid" : name ? "invalid": "hide"} />
                            </label>
                            <input
                                type="text"
                                id="username"
                                ref={userRef}
                                autoComplete="off"
                                onChange={nameChange}
                                value={name}
                                required
                                /*aria-invalid={validName ? "false" : "true"}
                                aria-describedby="uidnote"*/
                                onFocus={() => setNameFocus(true)}
                                onBlur={() => setNameFocus(false)}
                            />
                            <p id="uidnote" className={nameFocus && name && !validName ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                {errName?.toString()}
                            </p>

                            <label htmlFor="username">
                                Email:
                                <FontAwesomeIcon icon={validEmail ? faCheck : faTimes} className={validEmail ? "valid" : email ? "invalid": "hide"} />
                            </label>
                            <input
                                type="text"
                                id="email"
                                ref={userRef}
                                autoComplete="off"
                                onChange={emailChange}
                                value={email}
                                required
                                /*aria-invalid={validEmail ? "false" : "true"}
                                aria-describedby="uidnote"*/
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                            />
                            <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                {errEmail?.toString()}
                            </p>


                            <label htmlFor="password">
                                Parola:
                                <FontAwesomeIcon icon={validPwd ? faCheck : faTimes} className={validPwd ? "valid" : pwd ? "invalid": "hide"} />
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={passwordChange}
                                value={pwd}
                                required
                                /*aria-invalid={validPwd ? "false" : "true"}
                                aria-describedby="pwdnote"*/
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                            />
                            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                {errPwd?.toString()}
                            </p>


                            <label htmlFor="confirm_pwd">
                                Parola Doğrula:
                                <FontAwesomeIcon icon={validMatch ? faCheck : faTimes} className={validMatch ? "valid" : matchPwd ? "invalid": "hide"} />
                            </label>
                            <input
                                type="password"
                                id="confirm_pwd"
                                onChange={confirmPwdChange}
                                value={matchPwd}
                                required
                                /*aria-invalid={validMatch ? "false" : "true"}
                                aria-describedby="confirmnote"*/
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                            />
                            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Parolar eşleşmelidir.
                            </p>

                            <button disabled={!validName || !validEmail || !validPwd || !validMatch ? true : false}>Kayıt Ol</button>
                        </form>

                        <p>
                            Hesabın var mı?<br />
                            <span className="line">
                                {/*put router link here*/}
                                <a href="/login">Giriş Yap</a>
                            </span>
                        </p>
                    </section>
                    
            }
        </>
    )
}

export default Register