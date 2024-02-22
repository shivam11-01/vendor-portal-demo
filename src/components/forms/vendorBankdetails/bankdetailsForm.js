import { onAuthStateChanged } from 'firebase/auth';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { auth, db, storage } from '../../../firebase.config';
import { setDocument, updateDocument } from '../../../utils/api';
import { showToast } from '../../../utils/toast';
import { checkFileSize } from '../../../utils/utils';
import { Spinner } from '../../reusable/spinner/Spinner';
import Termsandcondition from "../../reusable/modal/termsandcondition";
import ReactToPrint from 'react-to-print';
import { useNavigate } from 'react-router-dom';


const VendorEInvoicing = () => {
    const [user, setuser] = useState()
    const [forms, setforms] = useState()
    const [loader, setLoader] = useState(false);
    const [load, setLoad] = useState(true)
    const [showModal, setshowModal] = useState(false);
    const [recall, setrecall] = useState(false);
    const [cheque, setcheque] = useState()
    const [data, setdata] = useState({
        beneficiaryName: "",
        address: "",
        phone: "",
        pancard: "",
        email: "",
    })
    const [userdata, setuserdata] = useState({
        name: "",
        address: "",
        phone: "",
        pancard: "",
        email: "",
    })
    const [bank, setbank] = useState({})
    const [error, seterror] = useState("")
    const navigate = useNavigate();

    const fileRef = useRef()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setuser(user);
            }
        });
    }, []);

    useEffect(() => {
        if (user) {
            onSnapshot(doc(db, "users", user.uid), (doc) => {
                const _tmp = doc.data()
                setforms(_tmp?.forms);
                setbank(_tmp?.bankDetails);
                setdata({
                    beneficiaryName: _tmp?.name,
                    address: _tmp?.address,
                    phone: _tmp?.phone,
                    pancard: _tmp?.pancard,
                    email: _tmp?.email,
                });
            });
            onSnapshot(doc(db, "documents", user.uid), (doc) => {
                const _tmp = doc.data()
                setcheque(_tmp?.cancelledCheque);
            });
            setTimeout(() => setLoad(false), 1500)

        }
    }, [user])

    const handleChange = (e) => {
        if (user) {
            setLoader(true);
            const file = e.target.files[0];
            const metadata = {
                contentType: file.type,
            };

            checkFileSize(file.size);

            const storageRef = ref(storage, `vendors/${user.uid}/documents/${file.name}`);
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
                        setcheque(url);
                        await updateDocument("documents", user.uid, { cancelledCheque: url });
                        setLoader(false);
                    });
                }
            );

        }
    }

    const handleSubmit = async (e) => {
        if (user && user.uid) {
            if (cheque != null || cheque != undefined) {
                await updateDoc(doc(db, "users", user.uid), {
                    name: data?.beneficiaryName,
                    phone: data?.phone,
                    pancard: data?.pancard,
                    email: data?.email,
                    address: data?.address,
                    bankDetails: bank,
                    "forms.bankdetails": 1
                });
                const currentDate = Date.now();
                const log = {
                    title: `${user.displayName} submitted Bank Details`,
                    timestamp: currentDate,
                }
                await updateDoc(doc(db, "users", user.uid), {
                    "logs": arrayUnion(log),
                });
                showToast('success', 'Vendor Bank Details Saved Successfully');
                navigate('/dashboard');
                return;
            } else {
                showToast('info', 'Please Upload Cancelled Cheque and Bank Certificate!');
                return;
            }
        }
    }
    useEffect(() => {
        if (recall === true) {
            handleSubmit();
            setrecall(false);
        }
    }, [recall])

    const printDivRef = useRef();

    return (
        <>
            <div id="maindiv" className='p-4 w-full h-full rounded-lg border-gray-800 glass' style={{ height: load ? "calc(100vh - 80px)" : "100%" }}>
                <div ref={printDivRef} id="printref" className='p-10 pt-0 lg:w-full m-auto align-center rounded-lg border-gray-800 glass'>
                    <h3 className='p-3 text-white text-center h3 border-bottom border-secondary break-all mb-4'>Vendor Bank Details</h3>
                    {load ?
                        <Spinner loader={load} />
                        :
                        <form onSubmit={(e) => { e.preventDefault(); setshowModal(true) }}>
                            <p className="h4 text-white border-bottom pb-2 mb-3">User Details</p>
                            <div className="row">
                                <div className="mb-3 col-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Name of the Beneficiary</label>
                                    <input
                                        type="text"
                                        value={data?.beneficiaryName?.toUpperCase()}
                                        disabled={forms?.bankdetails === 1 || forms?.bankdetails === 2}
                                        onChange={(e) => setdata({
                                            ...data,
                                            beneficiaryName: e.target.value
                                        })}
                                        className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-3 col-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Contact Number</label>
                                    <input
                                        type="text"
                                        className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={data?.phone}
                                        disabled={forms?.bankdetails === 1 || forms?.bankdetails === 2}
                                        onChange={(e) => setdata({
                                            ...data,
                                            phone: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div className="mb-3 col-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-300">PAN Number</label>
                                    <input
                                        type="text"
                                        className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={data?.pancard}
                                        disabled={forms?.bankdetails === 1 || forms?.bankdetails === 2}
                                        onChange={(e) => setdata({
                                            ...data,
                                            pancard: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div className="mb-3 col-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Email</label>
                                    <input
                                        type="text"
                                        className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={data?.email}
                                        disabled={forms?.bankdetails === 1 || forms?.bankdetails === 2}
                                        onChange={(e) => setdata({
                                            ...data,
                                            email: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div className="mb-3 col-8">
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Address</label>
                                    <input
                                        type="text"
                                        className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={data?.address}
                                        disabled={forms?.bankdetails === 1 || forms?.bankdetails === 2}
                                        onChange={(e) => setdata({
                                            ...data,
                                            address: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                            </div>
                            <p className="h4 text-white border-bottom pb-2 mb-3">Bank Details</p>
                            <div className="row">
                                <div className="mb-3 col-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Bank Name</label>
                                    <input
                                        type="text"
                                        className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bank?.bankName}
                                        onChange={(e) => setbank({ ...bank, bankName: e.target.value })}
                                        required
                                        disabled={forms?.bankdetails === 1 || forms?.bankdetails === 2}
                                    />
                                    <p className="text-red-500 text-sm pt-2">{error}</p>
                                </div>
                                <div className="mb-3 col-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Bank Branch Name</label>
                                    <input
                                        type="text"
                                        className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bank?.bankBranchName}
                                        onChange={(e) => setbank({ ...bank, bankBranchName: e.target.value })}
                                        required
                                        disabled={forms?.bankdetails === 1 || forms?.bankdetails === 2}
                                    />

                                    <p className="text-red-500 text-sm pt-2">{error}</p>
                                </div>
                                <div className="mb-3 col-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Bank Account Type</label>
                                    <select
                                        defaultValue=""
                                        onChange={(e) => setbank({
                                            ...bank, bankAccountType: e.target.value
                                        })}
                                        value={bank?.bankAccountType}
                                        className="bg-gray-500 shadow-none border-none text-gray-50 text-sm rounded-lg block w-full p-2.5 placeholder-gray-700 disabled:opacity-80"
                                        aria-label="Default select"
                                        disabled={forms?.bankdetails === 1 || forms?.bankdetails === 2}
                                        required
                                    >
                                        <option selected value="" disabled>Select</option>
                                        <option value="Savings">Savings</option>
                                        <option value="Current">Current</option>
                                    </select>

                                    <p className="text-red-500 text-sm pt-2">{error}</p>
                                </div>
                                <div className="mb-3 col-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Bank Account Number</label>
                                    <input
                                        type="text"
                                        className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bank?.bankAccountNumber}
                                        onChange={(e) => setbank({ ...bank, bankAccountNumber: e.target.value })}
                                        required
                                        disabled={forms?.bankdetails === 1 || forms?.bankdetails === 2}
                                    />

                                    <p className="text-red-500 text-sm pt-2">{error}</p>
                                </div>
                                <div className="mb-3 col-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-300">MICR Code <small>(All Digits)</small></label>
                                    <input
                                        type="text"
                                        className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bank?.bankMICR}
                                        onChange={(e) => setbank({ ...bank, bankMICR: e.target.value })}
                                        disabled={forms?.bankdetails === 1 || forms?.bankdetails === 2}
                                    />

                                    <p className="text-red-500 text-sm pt-2">{error}</p>
                                </div>
                                <div className="mb-3 col-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-300">IFSC Code <small>(All Digits)</small></label>
                                    <input
                                        type="text"
                                        className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bank?.ifscCode}
                                        onChange={(e) => setbank({ ...bank, ifscCode: e.target.value })}
                                        required
                                        disabled={forms?.bankdetails === 1 || forms?.bankdetails === 2}
                                    />

                                    <p className="text-red-500 text-sm pt-2">{error}</p>
                                </div>
                                <div className="mb-3 col-6">
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Bank Address</label>
                                    <textarea
                                        rows={3}
                                        type="text"
                                        className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={bank?.bankBranchAddress}
                                        onChange={(e) => setbank({ ...bank, bankBranchAddress: e.target.value })}
                                        required
                                        disabled={forms?.bankdetails === 1 || forms?.bankdetails === 2}
                                    />
                                </div>
                                <div className="mb-3 col-6">
                                    <label id="cctext" className="block mb-2 text-sm font-medium text-gray-300">Cancelled Cheque or Bank Certificate {cheque && <small>(<a href={cheque} className="text-primary underline" target="_blank">View</a>)</small>}</label>
                                    <div id="chequeUpload" className="bg-gray-400 mt-1 file_upload rounded-lg d-flex align-items-center flex-col justify-content-center" >
                                        <input type="file" id="fileupload" accept='image/*,application/pdf' disabled={forms?.bankdetails === 1 || forms?.bankdetails === 2} ref={fileRef} className="d-none" onChange={handleChange} />
                                        {cheque && cheque != "" || cheque != undefined
                                            ?
                                            <label htmlFor="fileupload" className={cheque == "" || cheque == undefined ? "text-center text-black h-full w-full pt-3" : "text-center text-black h-full w-full pt-4"}>
                                                {cheque == "" || cheque == undefined ? "Drag or upload an PDF/Image" : "Cancelled Cheque"}
                                            </label>
                                            // <img className="img-fluid text-center text-black h-full w-full rounded-lg" onClick={() => { fileRef.current.click() }} src={data && data.signImage} alt="sign here" />
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
                                                    <label htmlFor="fileupload" className={cheque == "" || cheque == undefined ? "text-center text-black h-full w-full pt-3" : "text-center text-black h-full w-full pt-4"}>
                                                        {cheque == "" || cheque == undefined ? "Drag or upload an PDF/Image" : "Cancelled Cheque.pdf"}
                                                    </label>
                                                }
                                            </>
                                        }
                                    </div>
                                    <p className="text-red-500 text-sm pt-2">{error}</p>
                                </div>
                                <div id="extradiv" className="mb-3 col-6">
                                    <label className="block mb-2 text-sm font-medium text-gray-300"> </label>
                                    <a className="text-white opacity-80 underline hover:opacity-100 ease-in-out duration-300" href="https://firebasestorage.googleapis.com/v0/b/omg-vendor-portal.appspot.com/o/Vendor%20Bank%20Accounts%20Details%20Confirmation%20Letter.docx?alt=media&token=0fb820df-f6c3-4a89-a23f-0f10390e1c6d">
                                        Download Bank Certificate Sample Attachment
                                    </a>
                                </div>
                            </div>
                            {forms?.bankdetails == 0 && <button type='submit' className='rounded-lg bg-blue-800 text-white w-full p-2 disabled:opacity-50' disabled={forms?.bankdetails === 1}>Submit</button>}
                        </form>
                    }
                </div>
                {forms && forms?.bankdetails >= 2 ?
                    <>
                        <ReactToPrint
                            trigger={() => {
                                return <button className='rounded-lg bg-blue-800 text-white w-full p-2 my-3'>Print</button>
                            }}
                            onBeforeGetContent={() => {
                                document.getElementById('maindiv').classList.remove('glass');
                                document.getElementById('printref').classList.remove('glass');
                                document.getElementById('chequeUpload').classList.add('d-none');
                                document.getElementById('extradiv').classList.add('d-none');
                            }}
                            onAfterPrint={() => {
                                document.getElementById('maindiv').classList.add('glass');
                                document.getElementById('printref').classList.add('glass');
                                document.getElementById('chequeUpload').classList.remove('d-none');
                                document.getElementById('extradiv').classList.add('d-none');
                            }}
                            content={() => printDivRef.current}
                            documentTitle="Vendor Data Form"
                            pageStyle="print"
                        />
                    </>
                    : ""}
            </div>
            <Termsandcondition
                title="Are you sure you want to submit it?"
                subtitle="I hereby declare that all the information given above is true and correct to the best of my knowledge."
                show={showModal}
                setrecall={setrecall}
                onClose={() => setshowModal(false)}
            />
        </>
    )
}

export default VendorEInvoicing