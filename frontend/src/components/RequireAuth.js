import { useLocation, Navigate, Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode"
import { useSelector } from "react-redux";

const RequireAuth = ({ allowedRoles }) => {
    
    const location = useLocation();

    let accessToken = useSelector(state => state.user?.currentUser?.accessToken)
    const decoded = accessToken ? jwt_decode(accessToken) : undefined
    
    const roles = decoded?.roles || []
         
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