import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase.config';

const Sidebar = () => {
    const [toggle, setToggle] = useState(false)
    const [user, setUser] = useState()
    const [data, setData] = useState()
    const navigate = useNavigate()

    const handleShow = () => {
        setToggle(!toggle);
    }

    const usertype = sessionStorage.getItem('usertype');

    const location = window.location.href;

    useEffect(() => {
        if (location.includes("collapseSection")) {
            setToggle(true);
        }
    }, [location])

    useEffect(() => {
        onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u)
            } else {
                setUser()
            }
        });
    }, [])

    useEffect(() => {
        if (user) {
            onSnapshot(doc(db, "users", user.uid), (doc) => {
                const _tmp = doc.data()
                console.log(_tmp?.vendortype);
                console.log(_tmp?.vendortype != "Overhead", _tmp?.vendortype != "Trainee")
                console.log(_tmp?.vendortype != "Overhead", _tmp?.vendortype != "Trainee");
                setData(_tmp);
            });
        }
    }, [user])

    return (
        <>
            <aside className="lg:w-64 h-full" aria-label="Sidebar" style={{ position: "fixed", top: "62px", left: 0 }}>
                <div className="overflow-y-auto py-4 px-3 rounded glass h-full">
                    <ul className="space-y-2">
                        <li>
                            <p onClick={() => navigate("/dashboard")} title='Dashboard' className={location.includes("dashboard") ? "active flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600" : "flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600"}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 576 512"><path d="M304 240V16.6c0-9 7-16.6 16-16.6C443.7 0 544 100.3 544 224c0 9-7.6 16-16.6 16H304zM32 272C32 150.7 122.1 50.3 239 34.3c9.2-1.3 17 6.1 17 15.4V288L412.5 444.5c6.7 6.7 6.2 17.7-1.5 23.1C371.8 495.6 323.8 512 272 512C139.5 512 32 404.6 32 272zm526.4 16c9.3 0 16.6 7.8 15.4 17c-7.7 55.9-34.6 105.6-73.9 142.3c-6 5.6-15.4 5.2-21.2-.7L320 288H558.4z" /></svg>
                                <span className="flex-1 ml-3 text-white text-sm hover:block whitespace-nowrap hidden sm:block md:block lg:block">Dashboard</span>
                            </p>
                        </li>
                        {
                        // user?.emailVerified &&
                         usertype == "vendor" ?
                            <>
                                {data?.vendortype == "Trainee" ?
                                    <li>
                                        <p onClick={() => navigate("/mt-vendor-form")} title='Non-applicability of GST' className={location.includes("mt-vendor-form") ? "active flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600" : "flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600"}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 576 512"><path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zM272 192H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H272c-8.8 0-16-7.2-16-16s7.2-16 16-16zM256 304c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H272c-8.8 0-16-7.2-16-16zM164.1 160v6.3c6.6 1.2 16.6 3.2 21 4.4c10.7 2.8 17 13.8 14.2 24.5s-13.8 17-24.5 14.2c-3.8-1-17.4-3.7-21.7-4.3c-12.2-1.9-22.2-.3-28.6 2.6c-6.3 2.9-7.9 6.2-8.2 8.1c-.6 3.4 0 4.7 .1 5c.3 .5 1 1.8 3.6 3.5c6.1 4.2 15.7 7.2 29.9 11.4l.8 .2c12.1 3.7 28.3 8.5 40.4 17.4c6.7 4.9 13 11.4 16.9 20.5c4 9.1 4.8 19.1 3 29.4c-3.3 19-15.9 32-31.6 38.7c-4.9 2.1-10 3.6-15.4 4.6V352c0 11.1-9 20.1-20.1 20.1s-20.1-9-20.1-20.1v-6.4c-9.5-2.2-21.9-6.4-29.8-9.1c-1.7-.6-3.2-1.1-4.4-1.5c-10.5-3.5-16.1-14.8-12.7-25.3s14.8-16.1 25.3-12.7c2 .7 4.1 1.4 6.4 2.1l0 0 0 0c9.5 3.2 20.2 6.9 26.2 7.9c12.8 2 22.7 .7 28.8-1.9c5.5-2.3 7.4-5.3 8-8.8c.7-4 .1-5.9-.2-6.7c-.4-.9-1.3-2.2-3.7-4c-5.9-4.3-15.3-7.5-29.3-11.7l-2.2-.7c-11.7-3.5-27-8.1-38.6-16c-6.6-4.5-13.2-10.7-17.3-19.5c-4.2-9-5.2-18.8-3.4-29c3.2-18.3 16.2-30.9 31.1-37.7c5-2.3 10.3-4 15.9-5.1v-6c0-11.1 9-20.1 20.1-20.1s20.1 9 20.1 20.1z" /></svg>
                                            <span className="flex-1 ml-3 text-white text-sm whitespace-nowrap hidden text-truncate sm:block md:block lg:block text-truncate">Vendor Form</span>
                                        </p>
                                    </li>
                                    :
                                    <li>
                                        <div className="d-flex align-items-center cursor-pointer">
                                            {/* /new-vendor-data-form */}
                                            <p onClick={() => navigate("/vendor-form")} title='Vendor Form' className={location.includes("vendor-form") ? "active transition-all flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600" : "transition-all flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600"}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z" /></svg>
                                                <span className="flex-1 ml-3 text-white text-sm whitespace-nowrap hidden text-truncate sm:block md:block lg:block text-truncate">Vendor Data Form</span>
                                            </p>
                                            <div onClick={handleShow} className="transition-all items-center px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600 sm:block md:block lg:flex hidden">
                                                {toggle ?
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg>
                                                    </>
                                                    : <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                                    </>

                                                }
                                            </div>
                                        </div>
                                        {toggle ?
                                            <ul className='ms-2 mt-2 transition-all'>
                                                <li>
                                                    <a href="/vendor-form#collapseSectionOne" className={location.includes("vendor-form#collapseSectionOne") ? "active flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600" : "flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600"}>
                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 256 512"><path d="M160 64c0-11.8-6.5-22.6-16.9-28.2s-23-5-32.9 1.6l-96 64C-.5 111.2-4.4 131 5.4 145.8s29.7 18.7 44.4 8.9L96 123.8V416H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H160V64z" /></svg> */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 448 512"><path d="M448 75.2v361.7c0 24.3-19 43.2-43.2 43.2H43.2C19.3 480 0 461.4 0 436.8V75.2C0 51.1 18.8 32 43.2 32h361.7c24 0 43.1 18.8 43.1 43.2zm-37.3 361.6V75.2c0-3-2.6-5.8-5.8-5.8h-9.3L285.3 144 224 94.1 162.8 144 52.5 69.3h-9.3c-3.2 0-5.8 2.8-5.8 5.8v361.7c0 3 2.6 5.8 5.8 5.8h361.7c3.2.1 5.8-2.7 5.8-5.8zM150.2 186v37H76.7v-37h73.5zm0 74.4v37.3H76.7v-37.3h73.5zm11.1-147.3l54-43.7H96.8l64.5 43.7zm210 72.9v37h-196v-37h196zm0 74.4v37.3h-196v-37.3h196zm-84.6-147.3l64.5-43.7H232.8l53.9 43.7zM371.3 335v37.3h-99.4V335h99.4z" /></svg>
                                                        <span className="flex-1 ml-3 text-white text-sm whitespace-nowrap hidden text-truncate sm:block md:block lg:block text-truncate">Section I</span>
                                                    </a>
                                                </li>
                                                
                                                <li>
                                                    <a href="/vendor-form#collapseSectionSix" className={location.includes("vendor-form#collapseSectionSix") ? "active flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600" : "flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600"}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 448 512"><path d="M448 75.2v361.7c0 24.3-19 43.2-43.2 43.2H43.2C19.3 480 0 461.4 0 436.8V75.2C0 51.1 18.8 32 43.2 32h361.7c24 0 43.1 18.8 43.1 43.2zm-37.3 361.6V75.2c0-3-2.6-5.8-5.8-5.8h-9.3L285.3 144 224 94.1 162.8 144 52.5 69.3h-9.3c-3.2 0-5.8 2.8-5.8 5.8v361.7c0 3 2.6 5.8 5.8 5.8h361.7c3.2.1 5.8-2.7 5.8-5.8zM150.2 186v37H76.7v-37h73.5zm0 74.4v37.3H76.7v-37.3h73.5zm11.1-147.3l54-43.7H96.8l64.5 43.7zm210 72.9v37h-196v-37h196zm0 74.4v37.3h-196v-37.3h196zm-84.6-147.3l64.5-43.7H232.8l53.9 43.7zM371.3 335v37.3h-99.4V335h99.4z" /></svg>
                                                        <span className="flex-1 ml-3 text-white text-sm whitespace-nowrap hidden text-truncate sm:block md:block lg:block text-truncate">Section VI</span>
                                                    </a>
                                                </li>
                                            </ul>
                                            : ""}
                                    </li>


                                }
                                {data?.isGSTApplicable == "no" &&
                                    <li>
                                        <p onClick={() => navigate("/nonapplicability")} title='Non-applicability of GST' className={location.includes("nonapplicability") ? "active flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600" : "flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600"}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 576 512"><path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zM272 192H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H272c-8.8 0-16-7.2-16-16s7.2-16 16-16zM256 304c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H272c-8.8 0-16-7.2-16-16zM164.1 160v6.3c6.6 1.2 16.6 3.2 21 4.4c10.7 2.8 17 13.8 14.2 24.5s-13.8 17-24.5 14.2c-3.8-1-17.4-3.7-21.7-4.3c-12.2-1.9-22.2-.3-28.6 2.6c-6.3 2.9-7.9 6.2-8.2 8.1c-.6 3.4 0 4.7 .1 5c.3 .5 1 1.8 3.6 3.5c6.1 4.2 15.7 7.2 29.9 11.4l.8 .2c12.1 3.7 28.3 8.5 40.4 17.4c6.7 4.9 13 11.4 16.9 20.5c4 9.1 4.8 19.1 3 29.4c-3.3 19-15.9 32-31.6 38.7c-4.9 2.1-10 3.6-15.4 4.6V352c0 11.1-9 20.1-20.1 20.1s-20.1-9-20.1-20.1v-6.4c-9.5-2.2-21.9-6.4-29.8-9.1c-1.7-.6-3.2-1.1-4.4-1.5c-10.5-3.5-16.1-14.8-12.7-25.3s14.8-16.1 25.3-12.7c2 .7 4.1 1.4 6.4 2.1l0 0 0 0c9.5 3.2 20.2 6.9 26.2 7.9c12.8 2 22.7 .7 28.8-1.9c5.5-2.3 7.4-5.3 8-8.8c.7-4 .1-5.9-.2-6.7c-.4-.9-1.3-2.2-3.7-4c-5.9-4.3-15.3-7.5-29.3-11.7l-2.2-.7c-11.7-3.5-27-8.1-38.6-16c-6.6-4.5-13.2-10.7-17.3-19.5c-4.2-9-5.2-18.8-3.4-29c3.2-18.3 16.2-30.9 31.1-37.7c5-2.3 10.3-4 15.9-5.1v-6c0-11.1 9-20.1 20.1-20.1s20.1 9 20.1 20.1z" /></svg>
                                            <span className="flex-1 ml-3 text-white text-sm whitespace-nowrap hidden text-truncate sm:block md:block lg:block text-truncate">Non applicability of GST</span>
                                        </p>
                                    </li>
                                }

                                {data?.isEinvoicingApplicable == "no" &&
                                    <li>
                                        <p onClick={() => navigate("/vendor-einvoicing")} title='Vendor E-Invoicing' className={location.includes("vendor-einvoicing") ? "active flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600" : "flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600"}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 80c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16zm128 72c8.8 0 16 7.2 16 16v17.3c8.5 1.2 16.7 3.1 24.1 5.1c8.5 2.3 13.6 11 11.3 19.6s-11 13.6-19.6 11.3c-11.1-3-22-5.2-32.1-5.3c-8.4-.1-17.4 1.8-23.6 5.5c-5.7 3.4-8.1 7.3-8.1 12.8c0 3.7 1.3 6.5 7.3 10.1c6.9 4.1 16.6 7.1 29.2 10.9l.5 .1 0 0 0 0c11.3 3.4 25.3 7.6 36.3 14.6c12.1 7.6 22.4 19.7 22.7 38.2c.3 19.3-9.6 33.3-22.9 41.6c-7.7 4.8-16.4 7.6-25.1 9.1V440c0 8.8-7.2 16-16 16s-16-7.2-16-16V422.2c-11.2-2.1-21.7-5.7-30.9-8.9l0 0c-2.1-.7-4.2-1.4-6.2-2.1c-8.4-2.8-12.9-11.9-10.1-20.2s11.9-12.9 20.2-10.1c2.5 .8 4.8 1.6 7.1 2.4l0 0 0 0 0 0c13.6 4.6 24.6 8.4 36.3 8.7c9.1 .3 17.9-1.7 23.7-5.3c5.1-3.2 7.9-7.3 7.8-14c-.1-4.6-1.8-7.8-7.7-11.6c-6.8-4.3-16.5-7.4-29-11.2l-1.6-.5 0 0c-11-3.3-24.3-7.3-34.8-13.7c-12-7.2-22.6-18.9-22.7-37.3c-.1-19.4 10.8-32.8 23.8-40.5c7.5-4.4 15.8-7.2 24.1-8.7V232c0-8.8 7.2-16 16-16z" /></svg>
                                            <span className="flex-1 ml-3 text-white text-sm whitespace-nowrap hidden text-truncate sm:block md:block lg:block text-truncate">Vendor E-Invoicing</span>
                                        </p>
                                    </li>}
                                <li>
                                    <p onClick={() => navigate("/vendor-bankdetails")} title='Vendor Bank Details' className={location.includes("vendor-bankdetails") ? "active flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600" : "flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 512 512"><path d="M243.4 2.6l-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160v8c0 13.3 10.7 24 24 24H456c13.3 0 24-10.7 24-24v-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8.1-3.4-17.2-3.4-25.2 0zM128 224H64V420.3c-.6 .3-1.2 .7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512H480c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1V224H384V416H344V224H280V416H232V224H168V416H128V224zm128-96c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" /></svg>
                                        <span className="flex-1 ml-3 text-white text-sm whitespace-nowrap hidden text-truncate sm:block md:block lg:block text-truncate">Vendor Bank Details</span>
                                    </p>
                                </li>

                                {data?.vendortype == "Overhead" || data?.vendortype == "Trainee" ?
                                    ""
                                    :
                                    <li>
                                        <p onClick={() => navigate("/msa")} title='Vendor Master Service Agreement' className={location.includes("exportnda") ? "active flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600" : "flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600"}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM80 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm54.2 253.8c-6.1 20.3-24.8 34.2-46 34.2H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h8.2c7.1 0 13.3-4.6 15.3-11.4l14.9-49.5c3.4-11.3 13.8-19.1 25.6-19.1s22.2 7.7 25.6 19.1l11.6 38.6c7.4-6.2 16.8-9.7 26.8-9.7c15.9 0 30.4 9 37.5 23.2l4.4 8.8H304c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-6.1 0-11.6-3.4-14.3-8.8l-8.8-17.7c-1.7-3.4-5.1-5.5-8.8-5.5s-7.2 2.1-8.8 5.5l-8.8 17.7c-2.9 5.9-9.2 9.4-15.7 8.8s-12.1-5.1-13.9-11.3L144 349l-9.8 32.8z" /></svg>
                                            <span className="flex-1 ml-3 text-white text-sm whitespace-nowrap hidden text-truncate sm:block md:block lg:block text-truncate">Vendor Master Service Agreement</span>
                                        </p>
                                    </li>
                                }
                                <li>
                                    <p onClick={() => navigate(data?.vendortype == "Trainee" ? "/mt-upload-documents" : "/upload-documents")} title='Document Upload' className={location.includes("upload-documents") ? "active flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600" : "flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z" /></svg>
                                        <span className="flex-1 ml-3 text-white text-sm whitespace-nowrap hidden text-truncate sm:block md:block lg:block text-truncate">Document Upload</span>
                                    </p>
                                </li>
                                <li>
                                    <p onClick={() => navigate("/queries")} title='Queries' className={location.includes("queries") ? "active flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600" : "flex items-center cursor-pointer px-2.5 py-2 text-base font-normal text-gray-900 rounded-lg hover:bg-slate-600"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 384 512"><path d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM105.8 229.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L216 328.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V314.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H158.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM160 416a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" /></svg>
                                        <span className="flex-1 ml-3 text-white text-sm whitespace-nowrap hidden text-truncate sm:block md:block lg:block text-truncate">Queries</span>
                                    </p>
                                </li>
                            </>
                            : ""}
                    </ul>
                </div>
            </aside>

        </>
    )
}

export default Sidebar