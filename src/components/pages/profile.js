import React, { useEffect, useRef, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../../firebase.config';
import { BASE_URL, BASE_URL_LOCAL, setDocument, updateDocument } from '../../utils/api';
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { showToast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { Spinner, SmallSpinner } from '../reusable/spinner/Spinner';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState()
    const [data, setData] = useState()
    const [sign, setSign] = useState()
    const [load, setLoad] = useState(true)
    const [submitload, setsubmitload] = useState(false)
    const [error, seterror] = useState({
        pancard: "",
        aadharcard: "",
    })
    const [loader, setLoader] = useState(false)
    const imageRef = useRef()

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser()
            }
        });
    }, [])

    useEffect(() => {
        if (user) {
            onSnapshot(doc(db, "users", user.uid), (doc) => {
                const _tmp = doc.data()
                setData(_tmp);
            });
            onSnapshot(doc(db, "documents", user.uid), (doc) => {
                setSign(doc?.data()?.signImage);
            });
            setTimeout(() => setLoad(false), 1500);
        }
    }, [user])

    const setVendorStatus = async () => {
        if (
            data?.forms?.status == 0 &&
            data?.forms?.bankdetails == 1 &&
            data?.forms?.vendorform == 1 &&
            (data?.isEinvoicingApplicable == "no" && data?.forms?.einvoicing == 1) ||
            (data?.isGSTApplicable == "no" && data?.forms?.nonapplicability == 1) ||
            (data?.vendortype != "Overhead" && data?.forms?.msa == 1)
        ) {
            await updateDocument("users", user.uid, { "forms.status": 1 });
        }
    }

    useEffect(() => {
        setVendorStatus();
    }, [user, data?.forms])

    const handlePAN = (e) => {
        var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
        let panNo = e.target.value.toUpperCase();
        setData({
            ...data,
            pancard: panNo
        });
        if (panNo.length == 10) {
            if (regpan.test(panNo)) {
                seterror({
                    ...error,
                    pancard: ""
                });
            } else {
                setData({
                    ...data,
                    pancard: ""
                })
                seterror({
                    ...error,
                    pancard: "Enter Valid PAN Number!"
                })
            }
        }
    }

    const handleGSTIN = (e) => {
        let regTest = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        let gst = e.target.value.toUpperCase();
        setData({
            ...data,
            GSTIN: gst,
        })
        if (gst.length == 15) {
            if (regTest.test(gst)) {
                seterror({
                    ...error,
                    gstin: ""
                });
            } else {
                setData({
                    ...data,
                    GSTIN: ""
                })
                seterror({
                    ...error,
                    gstin: "Enter Valid GSTIN Number"
                })
            }
        }
    }

    const handleAadhar = (e) => {
        // let regexp = /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/;
        let aadhar = e.target.value.toUpperCase();
        setData({
            ...data,
            aadharcard: aadhar
        });
        // if (aadhar.length == 14) {
        //     if (regexp.test(aadhar)) {
        //         seterror({
        //             ...error,
        //             aadharcard: ""
        //         });
        //     } else {
        //         setData({
        //             ...data,
        //             aadharcard: ""
        //         })
        //         seterror({
        //             ...error,
        //             aadharcard: "Enter Valid Aadhar Card Number with spaces!"
        //         })
        //     }
        // }
    }

    const handleChange = (e) => {
        if (user) {
            setLoader(true);
            const file = e.target.files[0];
            const metadata = {
                contentType: file.type,
            };
            const storageRef = ref(storage, `vendors/${user.uid}/${uuidv4()}`);
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                },
                (err) => console.log(err),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                        setSign(url);
                        await setDocument("documents", user.uid, { signImage: url }, { merge: true });
                        setLoader(false);
                    });
                }
            );
        }
    }

    const handleSaveProfile = async (e) => {
        setsubmitload(true);
        e.preventDefault();
        try {
            if (data && data.usertype == "introducer") {
                await updateDocument("users", user.uid, data);
                // await updateDocument("users", user.uid, { gstmailsend: true });
                seterror({})
                showToast('success', 'Profile Saved Successfully');
                setsubmitload(false);
                setTimeout(() => navigate("/dashboard"), 800);
            }
            if (data && error?.pancard == "" && error?.aadharcard == "" && data?.pancard.length == 10) {
                await updateDocument("users", user.uid, data);
                if (data?.isGSTApplicable == "yes") {
                    await updateDocument("users", user.uid, { gstmailsend: true });
                } else {
                    await updateDocument("users", user.uid, { gstmailsend: false });
                }
                if (data?.GSTIN && data?.gstmailsend == undefined || data?.gstmailsend == false) {
                    const payload = {
                        name: data?.name,
                        email: data?.email,
                        gstin: data?.GSTIN
                    }
                    await axios.post(`${BASE_URL}/api/mail/sendgst`, payload)
                        .then((res) => {
                            if (res && res?.data?.messageID) {
                                setsubmitload(false);
                                showToast('success', 'Profile Saved and GST Team Notified');
                                return;
                            }
                        })
                        .catch((err) => {
                            console.log('Mail not send' + err);
                            showToast("warning", err);
                            setsubmitload(false);
                            return;
                        })
                }
                seterror({})
                showToast('success', 'Profile Saved Successfully');
                setsubmitload(false);
                setTimeout(() => navigate("/dashboard"), 800);
            }
            setsubmitload(false);
        } catch { }
    }

    const handleChangePassword = () => {
        setsubmitload(true);
        sendPasswordResetEmail(auth, user.email)
            .then(() => {
                showToast('success', `Password Reset Mail send to ${user.email}`);
                setsubmitload(false);
            })
            .catch((error) => {
                const errorMessage = error.message;
                showToast('warning', errorMessage);
                setsubmitload(false);
            });
    }

    useEffect(() => {
        if (data?.pancard != "" || data?.pancard != undefined && data?.aadharcard || data?.aadharcard != undefined) {
        } else {
            navigate("/dashboard");
        }
    }, [])


    return (
        <div className='p-4 w-full h-full rounded-lg border-gray-800 shadow-md glass'>
            <form onSubmit={(e) => handleSaveProfile(e)}>
                <div className="p-3 pt-0 glass">
                    <div className='p-3 text-white text-center h3 border-bottom border-secondary break-all'>My Profile</div>
                    {load ?
                        <Spinner loader={load} />
                        :
                        <>
                            <div className="d-flex flex-wrap">
                                <div className="col-4 p-2 mb-1 text-wrap" style={{ wordBreak: "break-word" }}>
                                    <label className="text-white">User ID</label>
                                    <input type="text" value={data?.userid} disabled={data?.uid} className="form-control shadow-none glass focus:bg-transparent disabled:text-black disabled:opacity-50" required />
                                </div>
                                <div className="col-4 p-2 mb-1 text-wrap" style={{ wordBreak: "break-word" }}>
                                    <label className="text-white">Name</label>
                                    <input type="text" value={data?.name} onChange={(e) => setData({ ...data, name: e.target.value })} className="form-control shadow-none glass focus:bg-transparent text-white" required />
                                </div>
                                <div className="col-4 p-2 mb-1 text-wrap" style={{ wordBreak: "break-word" }}>
                                    <label className="text-white">Email</label>
                                    <input type="text" value={data?.email} disabled={data?.email} className="form-control shadow-none glass focus:bg-transparent disabled:text-black disabled:opacity-50" required />
                                </div>
                                <div className="col-4 p-2 mb-1 text-wrap" style={{ wordBreak: "break-word" }}>
                                    <label className="text-white">Designation</label>
                                    <input type="text" value={data?.designation} onChange={(e) => setData({ ...data, designation: e.target.value })} className="form-control shadow-none glass focus:bg-transparent text-white disabled:opacity-50" required />
                                </div>
                                <div className="col-4 p-2 mb-1 text-wrap" style={{ wordBreak: "break-word" }}>
                                    <label className="text-white">Contact Number</label>
                                    <input type="number" onChange={(e) => setData({ ...data, phone: e.target.value })} value={data?.phone} className="form-control text-white shadow-none glass focus:bg-transparent disabled:text-black disabled:opacity-50" required />
                                </div>
                                {data?.usertype == "vendor" &&
                                    <>
                                        <div className="col-4 p-2 mb-1 text-wrap" style={{ wordBreak: "break-word" }}>
                                            <label className="text-white">Pan Card</label>
                                            <input type="text" onChange={(e) => handlePAN(e)} value={data?.pancard} maxLength={10} className="form-control shadow-none text-white glass focus:bg-transparent disabled:text-black disabled:opacity-50" required />
                                            {error?.pancard && <p className="text-red-500 text-sm pt-1">{error?.pancard}</p>}
                                        </div>
                                        <div className="col-4 p-2 mb-1 text-wrap" style={{ wordBreak: "break-word" }}>
                                            <label className="text-white">Aadhar Card/CIN Number<small> (spaces not required)</small></label>
                                            <input type="text" onChange={(e) => handleAadhar(e)} value={data?.aadharcard} className="form-control mt-1 shadow-none glass focus:bg-transparent text-white disabled:opacity-50" required />
                                            {error?.aadharcard && <p className="text-red-500 text-sm pt-1">{error?.aadharcard}</p>}
                                        </div>
                                        <div className="col-4 p-2 mb-1 text-wrap" style={{ wordBreak: "break-word" }}>
                                            <label className="text-white">Introducer Name</label>
                                            <input type="text" onChange={(e) => setData({ ...data, fpoc: e.target.value })} disabled={data?.fpoc} value={data?.fpoc} className="form-control mt-1 shadow-none glass focus:bg-transparent text-black disabled:opacity-50" required />
                                        </div>
                                        <div className="col-4 p-2 mb-1 text-wrap" style={{ wordBreak: "break-word" }}>
                                            <label className="text-white">Introducer Email</label>
                                            <input type="text" onChange={(e) => setData({ ...data, fpocno: e.target.value })} disabled={data?.fpocno} value={data?.fpocno} className="form-control mt-1 shadow-none glass focus:bg-transparent text-black disabled:opacity-50" required />
                                        </div>
                                        {/* first point of contact */}
                                        <div className="col-8 p-2 mb-1 text-wrap" style={{ wordBreak: "break-word" }}>
                                            <label className="text-white">Address</label>
                                            <textarea type="text" rows={1} onChange={(e) => setData({ ...data, address: e.target.value })} value={data?.address} className="form-control mt-1 text-white shadow-none glass focus:bg-transparent disabled:text-black disabled:opacity-50" required />
                                        </div>
                                        <div className="col-4 p-2 mb-1 text-wrap" style={{ wordBreak: "break-word" }}>
                                            <label className="text-white">Nationality</label>
                                            <select
                                                defaultValue=""
                                                onChange={(e) => {
                                                    setData({
                                                        ...data,
                                                        nationality: e.target.value,
                                                    });
                                                }}
                                                value={data?.nationality}
                                                className="bg-gray-500 mt-1 shadow-none border-none text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" aria-label="Default select"
                                                required
                                            >
                                                <option value="Indian">Indian</option>
                                                <option value="Foreign">Foreign</option>
                                            </select>
                                        </div>
                                        <div className="col-4 p-2 mb-1 text-wrap">
                                            <label htmlFor="name" className="text-white">GST Number</label>
                                            <div className="input-group flex-nowrap">
                                                <select style={{ width: "80px" }}
                                                    onChange={(e) => {
                                                        setData({
                                                            ...data,
                                                            isGSTApplicable: e.target.value,
                                                            isEinvoicingApplicable: e.target.value == "yes" ? "no" : e.target.value == "no" ? "no" : "",
                                                            GSTIN: "",
                                                        });
                                                    }}
                                                    value={data?.isGSTApplicable}
                                                    className="bg-gray-500 mt-1 shadow-none border-none text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" aria-label="Default select"
                                                    required
                                                >
                                                    <option value="" selected>Select</option>
                                                    <option value="yes">Yes</option>
                                                    <option value="no">No</option>
                                                </select>
                                                <input type="text" onChange={(e) => handleGSTIN(e)} maxLength={15} value={data?.GSTIN} disabled={data?.isGSTApplicable == "no" || data?.isGSTApplicable == ""} className="glass mt-1 shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500" autoComplete='none' required />
                                            </div>
                                            {error?.gstin && <p className="text-red-500 text-sm pt-1">{error?.gstin}</p>}
                                        </div>
                                        {data?.isGSTApplicable == "yes" ?
                                            <div className="col-4 p-2 mb-1 text-wrap">
                                                <label htmlFor="name" className="text-white">E-invoicing</label>
                                                <div className="input-group flex-nowrap">
                                                    <select style={{ width: "80px" }} onChange={(e) => setData({ ...data, isEinvoicingApplicable: e.target.value })} value={data?.isEinvoicingApplicable} className="bg-gray-500 mt-1 shadow-none border-none text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" aria-label="Default select" required>
                                                        <option value="" selected>Select</option>
                                                        <option value="yes">Yes</option>
                                                        <option value="no">No</option>
                                                    </select>
                                                </div>
                                            </div>
                                            : ""}
                                        <div className="col-12 p-2 mb-1">
                                            <label className="text-white">Signature Upload</label>
                                            <div className="text-white mt-1 file_upload rounded-lg d-flex align-items-center flex-col justify-content-center" >
                                                <input type="file" id="imageupload" accept='image/*' ref={imageRef} className="d-none" onChange={handleChange} />
                                                {sign ?
                                                    <img className="img-fluid text-center text-black h-full w-full rounded-lg" onClick={() => { imageRef.current.click() }} src={sign} alt="sign here" />
                                                    :
                                                    <>
                                                        {loader &&
                                                            <div role="status">
                                                                <svg aria-hidden="true" class="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                                </svg>
                                                                <span class="sr-only">Loading...</span>
                                                            </div>
                                                        }
                                                        {!loader &&
                                                            <label htmlFor="imageupload" className="text-center text-black h-full w-full pt-3">
                                                                Drag or upload an Image
                                                            </label>
                                                        }
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </>
                                }

                            </div>
                            <div className="d-flex flex-col justify-end">
                                <p className="text-red-500 text-md font-bold pt-1">{error?.uploadError}</p>
                                <div className="col-4 flex justify-center align-middle p-2">
                                    {submitload ? <SmallSpinner loader={submitload} /> :
                                        <>
                                            <button className='btn btn-primary rounded-lg w-100 me-2' type='submit'><small>Save</small></button>
                                            <button className='btn btn-primary rounded-lg w-100 me-2' type='button' onClick={handleChangePassword}><small>Change Password</small></button>
                                        </>
                                    }
                                </div>
                            </div>
                        </>
                    }
                </div>
            </form>

        </div>
    )
}

export default Profile