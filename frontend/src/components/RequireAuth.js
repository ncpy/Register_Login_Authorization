import { useLocation, Navigate, Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode"
import { useSelector } from "react-redux";

const RequireAuth = ({ allowedRoles }) => {
    
    const location = useLocation();

    let accessToken = useSelector(state => state.user?.currentUser?.accessToken)
    const decoded = accessToken
        ? jwt_decode(accessToken)
        : undefined

    // eğer token ın süresi bittiyse manual olarak ..
    // .. roles ve acc.tkn sıfırla
    let roles = []
    if (decoded?.exp * 1000 < new Date().getTime()) {
        roles = []
        accessToken = "" //belki çok amatörce oldu bu çünkü accesstoken ı jwt ile yok etmek en mantıklısı..
        console.log("access token expired .. ")
    } else {
        roles = decoded?.roles || []
        console.log("allowedRoles: ", allowedRoles)
        console.log("roles in req.auth.js: ", roles)
    }


    return (
        roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : accessToken   //changed from email to accessToken to persist login after refresh
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;

//state={{ from:location }} replace /> => burası giriş yaptıktan sonra en son kalınan sayfayı manual olarak arayıp
//oraya gitmektense, giriş yapmadan önceki sayfayı hatırlayıp, girişten sonra direkt oraya gitmeyi sağlar
//geri tuşunun çalışmasını da sağlar