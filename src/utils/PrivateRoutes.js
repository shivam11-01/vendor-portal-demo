import { Outlet, Navigate } from 'react-router-dom';
import { auth } from '../firebase.config';

const PrivateRoutes = () => {
    return (
        sessionStorage.getItem('accessToken') ? <Outlet /> : <Navigate to="/" />
    )
};

export default PrivateRoutes;