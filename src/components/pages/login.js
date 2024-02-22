import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../reusable/navigation/navbar';
import { useDispatch } from 'react-redux';
import { onLogin } from '../../store/actions/loginAction';
import { showToast } from '../../utils/toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { SmallSpinner } from '../reusable/spinner/Spinner';

function Login() {
    const [error, setError] = useState('');
    const [usertype, setusertype] = useState('');
    const [load, setLoad] = useState(false);
    const [domain, setDomain] = useState('');
    const [show, setShow] = useState(true)

    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data, e) => {
        setLoad(true);
        e.preventDefault();
        if (data.email == "" || data.password == "") {
            showToast("error", "Please fill the details to login");
            return;
        }
        if (usertype === "introducer") {
            let email = data.email + domain;
            email = email.replaceAll(" ", "");
            dispatch(onLogin(setLoad, { email: email, password: data.password }));
        }
        if (usertype === "vendor") {
            dispatch(onLogin(setLoad, { email: data.email, password: data.password }));
        }
    };

    const handleUsertype = (e) => {
        setusertype(e);
        sessionStorage.setItem('usertype', e);
    }

    return (
        <>
            <Navbar />
            <div className="register d-flex justify-content-center glass border-gray-800 align-items-center text-align-center p-1" style={{ marginTop: "100px" }}>
                <div className="col-6 d-lg-block d-sm-none d-md-block d-none">
                    <video autoPlay loop muted>
                        <source src="https://firebasestorage.googleapis.com/v0/b/omg-vendor-portal.appspot.com/o/logoAnimation1.mp4?alt=media&token=a0bf28d9-2763-42ed-b92d-d1823015103b" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="col-12 col-lg-6 col-md-6 col-sm-12 d-flex justify-content-center align-items-center lg:p-2 md:p-2 sm:p-4 p-4">
                    <div className='col-12 col-lg-8 col-sm-10 col-md-8'>
                        {error ?
                            <div className="alert alert-danger alert-dismissible" role="alert">
                                <div>{error}</div>
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError([])}></button>
                            </div>
                            : ""}
                        <h1 className='h2 mb-2'>Login as</h1>
                        <form id='form' className='d-flex flex-column gap-3' onSubmit={handleSubmit(onSubmit)}>
                            <select
                                className="bg-gray-500 shadow-none border-none text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                aria-label="Default select"
                                onClick={(e) => handleUsertype(e.target.value)}
                                required
                            >
                                <option selected value="" disabled>Select Usertype</option>
                                <option value="introducer">Introducer</option>
                                <option value="vendor">Vendor</option>
                            </select>
                            <div className="d-flex">

                                {usertype === "introducer" ?
                                    <>
                                        <input
                                            type="text"
                                            className="glass left-rounded text-gray-50 placeholder:text-gray-400 px-3 py-2 form-control focus:bg-transparent focus:text-gray-50"
                                            {...register("email")}
                                            placeholder="Name.Surname"
                                            aria-label="Email"
                                            // autoComplete="off"
                                        />
                                        <select
                                            className="bg-gray-500 shadow-none border-none text-white rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-28 p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            aria-label="Default select"
                                            onChange={(e) => setDomain(e.target.value)}
                                            required
                                        >
                                            <option selected value="" disabled>@domain</option>
                                            <option value="@gmail.com">@gmail.com</option>
                                        </select>
                                    </>
                                    :
                                    <input
                                        type="text"
                                        className="glass text-gray-50 placeholder:text-gray-400 px-3 py-2 form-control focus:bg-transparent focus:text-gray-50"
                                        {...register("email")}
                                        placeholder="example@mail.com"
                                        aria-label="Email"
                                        // autoComplete='off'
                                    />
                                }
                            </div>
                            <div className='relative'>
								<input
									className="glass placeholder:text-gray-400 text-gray-50 px-3 py-2 form-control rounded-lg"
									type={show ? "password" : "text"}
									{...register("password")}
									placeholder="Password"
                                    // autoComplete='off'
								/>
								<div onClick={() => { show ? setShow(false) : setShow(true) }}>
									{show ? <AiOutlineEye className='top-3 text-black right-4 absolute h-5 w-5 cursor-pointer' /> :
										<AiOutlineEyeInvisible className='top-3 text-black right-4 absolute h-5 w-5 cursor-pointer' />}
								</div>
							</div>
                            {/* <input type="password" className="glass placeholder:text-gray-400 text-gray-50 px-3 py-2 form-control rounded-lg" {...register("password")} placeholder="Password" aria-label="Password" /> */}
                            {load ?
                                <SmallSpinner loader={load} className="m-auto" />
                                :
                                <button className='btn btn-primary rounded-lg w-100' disabled={load}>Login</button>
                            }
                            <p className="m-0">Register as a Introducer? <Link to='/register' className='text-primary'>Sign up</Link></p>
                        </form>
                        <small className="text-gray-400">Note: Vendor(s) can only be registered by introducer(s)</small>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;