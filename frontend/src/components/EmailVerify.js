import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axios1 } from '../api/myaxios';
import success from "../images/success.png";

const EmailVerify = () => {
	const [validUrl, setValidUrl] = useState(false);
	const { userId, uniqueString } = useParams();

	useEffect(() => {
		const verifyEmailUrl = async () => {
			
            await axios1.get(`/auth/verify/${userId}/${uniqueString}`)
                .then(response => {
                    console.log(response)
                    setValidUrl(true);
                })
                .catch(err => {
                    console.log(err);
                    setValidUrl(false);
                })
			
		};
		verifyEmailUrl();
	}, [ userId, uniqueString ]);

	return (
		<>
			{validUrl 
                ? 
                    <div className="verifyContainer">
                        <img src={success} alt="success_img" className="success_img" />
                        <h1>Email başarılı şekilde doğrulandı</h1>
                        <Link to="/login">
                            <button className="green_btn">Giriş Yap</button>
                        </Link>
                    </div>
                :
                    <h1>404 Bulunamadı</h1>
			}
		</>
	);
};

export default EmailVerify;