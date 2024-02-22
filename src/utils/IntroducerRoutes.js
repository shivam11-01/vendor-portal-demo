import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const usertype = sessionStorage.getItem('usertype')
    const token = sessionStorage.getItem('accessToken')

    return (
        token && usertype === "introducer" ? <Outlet /> : <Navigate to="/" />
    )
};

export default PrivateRoutes;