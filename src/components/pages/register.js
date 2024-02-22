import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from "../../firebase.config";
import Navbar from '../reusable/navigation/navbar';
import { setDocument } from '../../utils/api';
import { generateUniqueID } from '../../utils/utils';
import { SmallSpinner } from '../reusable/spinner/Spinner';
import { showToast } from '../../utils/toast';

function Register() {
    const [registerData, setRegisterData] = useState({});
    const [error, setError] = useState([]);
    const [load, setLoad] = useState(false);
    const [domain, setDomain] = useState();

    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data, e) => {
        e.preventDefault();
        if (data?.password === data?.confirmpwd) {
            let email = data.emailprefix + domain;
            email = email.replaceAll(" ", "");
            setLoad(true);
            setRegisterData(data);
            try {
                const user = await createUserWithEmailAndPassword(auth, email, data.password);
                updateProfile(auth.currentUser, {
                    displayName: data.name,
                });
                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        showToast("info", `Verification email send to ${email}`);
                    });
                sessionStorage.setItem('userDetails', JSON.stringify(user));
                const userdata = {
                    uid: user.user.uid,
                    email: email,
                    name: data.name,
                    userid: generateUniqueID(user.user.uid),
                    usertype: 'introducer',
                }
                await setDocument("users", user.user.uid, userdata);
                setLoad(false);
                navigate('/');
            } catch (err) {
                console.log(err.message);
                setLoad(false);
            }
        } else {
            setError("Password does not match!");
        }

    };


    return (
        <>
            <Navbar />
            <div className="register d-flex justify-content-center glass border-gray-800 align-items-center text-align-center p-1" style={{ marginTop: "100px" }}>
                <div className="col-6 d-lg-block d-sm-none d-md-block d-none">
                    <video autoPlay loop muted>
                        <source src="https://firebasestorage.googleapis.com/v0/b/omg-vendor-portal.appspot.com/o/logoAnimation.mp4?alt=media&token=329271ac-7189-4d45-b13f-f1d63c6dd8a8" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="col-12 col-lg-6 col-md-6 col-sm-12 d-flex justify-content-center align-items-center lg:p-2 md:p-2 sm:p-4 p-4">
                    <div className='col-12 col-lg-8 col-sm-10 col-md-8'>
                        <h1 className='h2 mb-4'>Introducer Sign Up</h1>
                        <form id='form' className='d-flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
                            <input type="text" className="glass text-sm text-gray-50 placeholder:text-gray-400 rounded-lg px-3 py-2 focus:bg-transparent focus:text-gray-50 form-control" {...register("name", { required: true })} placeholder="Employee Name" aria-label="Name" />
                            <div className="d-flex">
                                <input type="text" className="glass left-rounded text-sm text-gray-50 placeholder:text-gray-400 px-3 py-2 focus:bg-transparent focus:text-gray-50 form-control" {...register("emailprefix", { required: true })} placeholder="Name.Surname" aria-label="Email" />
                                <select
                                    name="vendorStatus"
                                    className="bg-gray-500 shadow-none border-none text-white text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-28 p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    aria-label="Default select"
                                    onChange={(e) => setDomain(e.target.value)}
                                    required
                                >
                                    <option selected value="" disabled>@domain</option>
                                    <option value="@gmail.com">@gmail.com</option>
                                </select>
                            </div>
                            <input type="password" className="glass text-sm text-gray-50 placeholder:text-gray-400 rounded-lg px-3 py-2 focus:bg-transparent focus:text-gray-50 form-control" {...register("password", { required: true })} placeholder="Password" aria-label="Password" />
                            <input type="password" className="glass text-sm text-gray-50 placeholder:text-gray-400 rounded-lg px-3 py-2 focus:bg-transparent focus:text-gray-50 form-control" {...register("confirmpwd", { required: true })} placeholder="Confirm Password" aria-label="Confirm Password" />
                            {errors.name?.type === "required" && <p className='text-red-500'>Name is required</p>}
                            {errors.email?.type === "required" && <p className='text-red-500'>Email is required</p>}
                            {error ? <p className='text-red-500'>{error}</p> : ""}
                            {load ?
                                <SmallSpinner loader={load} className="m-auto" />
                                :
                                <button className='btn btn-primary w-100 rounded-lg' disabled={load}>Register</button>
                            }
                            <p>Already a Introducer? <Link to='/' className='text-primary'>Login here</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;