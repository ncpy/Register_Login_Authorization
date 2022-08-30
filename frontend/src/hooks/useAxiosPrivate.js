import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { axiosPrvt } from '../api/myaxios'
import { updateSuccess } from '../redux/userRedux'
//import useRefreshToken from './useRefreshToken'

const useAxiosPrivate = () => {
    //const refresh = useRefreshToken()

    const accessToken = useSelector(state => state.user?.currentUser?.accessToken)
    console.log("accessTkn from state: ",accessToken)
    const dispatch = useDispatch()

    useEffect(() => {

        // herhangi bir request gönderilMEDEN önce çalıştır
        // yani görevi, headers ta Bearer + token var mı yok mu kontrol etmek, yoksa yazdırmak
        const requestIntercept = axiosPrvt.interceptors.request.use(
            config => { 
                if (!config.headers['rasoftauthorization']) {
                    config.headers['rasoftauthorization'] = `Bearer ${accessToken}`
                }
                return config
            }, (error) => Promise.reject(error)
        )

        // herhangi bir request gönderilirken çalıştır
        // görevi örn. özel linklere girerken eğer accessToken süresi dolduysa ki bu durumda hata verir..
        // ..hata verdikten sonra (yani artık accessToken kullanılmaz durumda) yeni bir accessToken oluşturmak
        // bunu da /refreshTkn router ı ile sağlamak. backend de refreshToken.js e bakınca accessToken döndürdüğü görülür
        const responseIntercept = axiosPrvt.interceptors.response.use(
            response =>  response,
            async (error) => {
                console.log("selam res err ", error?.response?.status)
                const prevRequest = error?.config

                // prevRequest?.sent bağıntıya ilave edilmeli ki sonsuz döngü kırılsın
                if (error?.response?.status === 400 && !prevRequest?.sent) {  //! 400 mü 403 mü
                    prevRequest.sent = true

                    const response = await axiosPrvt.get("/refreshTkn", {
                        withCredentials: true  //allow us to send cookies with our request
                    })
                    const accessToken = response?.data?.accessToken
                    console.log("new accesstkn: ", accessToken)


                    dispatch(updateSuccess(accessToken)) //state için  accessToken ı güncellemek
                    
                    prevRequest.headers['rasoftauthorization'] = `Bearer ${accessToken}`
                    
                    return axiosPrvt(prevRequest)
                }
                return Promise.reject(error)
            }
        )

        return () => { //cleanup func.
            axiosPrvt.interceptors.request.eject(requestIntercept);
            axiosPrvt.interceptors.response.eject(responseIntercept);
        }

    }, [accessToken, dispatch ])

    return axiosPrvt

}

export default useAxiosPrivate