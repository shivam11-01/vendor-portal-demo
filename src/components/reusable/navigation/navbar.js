import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import logo from "../../../assets/logo.webp";
import logo from "../../../assets/fading-logos.mp4";
import { auth } from '../../../firebase.config';
import { getInitials } from '../../../utils/utils';

const Navbar = () => {
    const [user, setUser] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser("")
            }
        });
    }, [])

    const handleLogout = () => {
        signOut(auth).then(() => {
            sessionStorage.clear();
            window.location.href = "/";
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <>
            <nav className="rounded bg-white fixed w-full z-20 top-0 left-0 border-b border-gray-600">
                <div className="row flex flex-wrap justify-between items-center mx-auto">
                    <p onClick={() => sessionStorage.getItem("accessToken") ? navigate("/dashboard") : navigate("/")} className="cursor-pointer col-2 flex items-center ps-4">
                        {/* <video autoPlay loop muted style={{ height: "50px", transform: "scale(1.3)" }}>
                            <source src="https://firebasestorage.googleapis.com/v0/b/omg-vendor-portal.appspot.com/o/fading-logos.mp4?alt=media&token=bb4abf00-370b-4559-8cf9-2946f59a51b8" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video> */}
                        {/* <img src={logo} style={{ filter: "brightness(1.75)" }} className="h-6 sm:h-9" alt="OMG" /> */}
                    </p>
                    {sessionStorage.getItem('accessToken') ?
                        <div className="col-9 text-end me-4">
                            <div className="dropdown">
                                <button className="rounded-full bg-purple-500 text-xl border-3 border-gray-500 shadow-none text-white w-11 h-11 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {getInitials(user.displayName)}
                                </button>
                                <ul className="dropdown-menu bg-slate-600 text-white">
                                    <li className='p-2 px-3 bg-slate-600'>
                                        <div className="text-start">
                                            <p className="text-xs">Signed in as</p>
                                            <p className="text-sm">{user.email ? user.email : "Your Email"}</p>
                                        </div>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    {/* {user?.emailVerified ?  */}
                                    <li><p onClick={() => navigate("/profile")} className="dropdown-item text-white hover:bg-slate-700 cursor-pointer"><i className="fa-solid fa-user pe-3" />Profile</p></li> 
                                    {/* : ""} */}
                                    <li><a className="dropdown-item text-white hover:bg-slate-700 cursor-pointer" onClick={handleLogout} ><i className="fa-solid fa-right-from-bracket pe-3" />Logout</a></li>
                                </ul>
                            </div>
                        </div>

                        : ""}
                </div>
            </nav>
        </>
    )
}

export default Navbar;