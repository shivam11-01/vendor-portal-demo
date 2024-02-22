import React, { useEffect, useState } from 'react';
import { auth, storage, db } from '../../../firebase.config';
import { showToast } from '../../../utils/toast';
import { doc, onSnapshot, deleteField, updateDoc, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { SmallSpinner, Spinner } from '../../reusable/spinner/Spinner'
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { setDocument, updateDocument } from '../../../utils/api';
import { Navigate, useNavigate } from 'react-router-dom';

const TraineeDocumentUpload = () => {
    const [user, setUser] = useState()
    const [userdata, setuserdata] = useState()
    const [data, setData] = useState({
        CompanyCertificate: true,
        GSTCertificate: true,
        PANTANCard: true,
    })
    const [load, setLoad] = useState({
        CompanyCertificate: false,
        GSTCertificate: false,
        PANTANCard: false,
    })
    const [loader, setLoader] = useState(true);

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
            console.log(user.uid);
            onSnapshot(doc(db, "documents", user.uid), (doc) => {
                const _tmp = doc.data()
                setData(_tmp);
                setTimeout(() => setLoader(false), 1500);
            });
            onSnapshot(doc(db, "users", user.uid), (doc) => {
                const _tmp = doc.data()
                setuserdata(_tmp);
                setTimeout(() => setLoader(false), 1500);
            });
        }
    }, [user])

    const handleChange = (e) => {
        const name = e.target.name.slice(0, -2);
        if (user) {
            setLoad({
                ...load,
                [name]: true
            });
            const file = e.target.files[0];
            const metadata = {
                contentType: file.type,
            };

            const storageRef = ref(storage, `vendors/${user.uid}/documents/${name}`);
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
                        setData({
                            ...data,
                            [name]: url,
                        })
                        setLoad({
                            ...load,
                            [name]: false
                        });
                        await setDocument("documents", user.uid, { [name]: url });
                        showToast('success', "Documents Uploaded successfully!");
                    });
                }
            );
        }
    }

    const handleButton = (e) => {
        document.getElementsByName(e.target.name + "ID")[0].click();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data?.CompanyCertificate == null || data?.PANTANCard == null
            || data?.CompanyCertificate == true || data?.PANTANCard == true) {
            showToast('error', "Please Upload the mandatory documents!");
            return;
        }
        await updateDocument("documents", user.uid, data);
        const currentDate = Date.now();
        const log = {
            title: `${user.displayName} uploaded and submitted Documents`,
            timestamp: currentDate,
        }
        await updateDoc(doc(db, "users", user.uid), {
            "logs": arrayUnion(log),
        });
        showToast('success', "Documents Saved successfully!");
        navigate('/dashboard');
    }

    const handleDeleteDocument = async (e) => {
        const id = e.target.id
        const docRef = ref(storage, `vendors/${user.uid}/documents/${id}`);
        // Delete the file
        deleteObject(docRef).then(() => {
            showToast("success", `${id} deleted successfully!`);
            setData({
                ...data,
                [id]: null,
            });
        }).catch((error) => {
            showToast("warning", error);
        });
        const delRef = doc(db, "documents", user.uid);
        await updateDoc(delRef, {
            [id]: deleteField()
        });
    }

    return (
        <div className='w-100'>
            <div className="p-3 pt-0 glass" style={{ minHeight: "calc(100vh - 80px)" }}>
                <div className='p-3 text-white text-center h3 border-bottom border-secondary break-all'>Documents Upload</div>
                <div className='mb-3'>
                    <div className='p-2 pt-0 pb-3 text-white'>
                        <h4>Note: While uploading, Please Rename your attachment according to the document.</h4>
                        <h4>(<span className="text-red-500">*</span>)<small> - mandatory documents</small></h4>
                    </div>

                    {loader ? <Spinner loader={loader} /> :
                        <>
                            <table className="table border-0 glass text-white">
                                <thead>
                                    <tr>
                                        <th className='text-center' width="10px">Sr. No.</th>
                                        <th className='text-center' width="280px">Document</th>
                                        <th className='text-center' width="90px">Yes/No</th>
                                        <th className='text-center' width="90px">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* 1 */}
                                    <tr>
                                        <td className='text-center'>1</td>
                                        <td>
                                            <p className='text-sm'>Company/LLP Registration Certificate / Aadhar Card for Individuals/Any governement approved certificate/permits for OTHERS<span className="text-red-500">*</span></p>
                                        </td>
                                        <td className='text-center'>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="me-3 text-sm font-medium text-gray-50">No</span>
                                                <label className="inline-flex relative items-center cursor-pointer">
                                                    <input type="checkbox" disabled name='CompanyCertificate' checked={true} onChange={(e) => setData({ ...data, [e.target.name]: e.target.checked })} className="sr-only peer" />
                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-50">Yes</span>
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                {load && load?.CompanyCertificate ? <div className='ms-4'> <SmallSpinner loader={load && load?.CompanyCertificate} /></div> :
                                                    <>
                                                        <button className={typeof data?.CompanyCertificate === 'string' ? 'd-none' : 'w-75 btn btn-primary text-sm rounded-lg disabled:bg-blue-500 w-50'} name="CompanyCertificate" onClick={(e) => handleButton(e)}>Upload</button>
                                                        <input className='d-none' name='CompanyCertificateID' type="file" onChange={(e) => handleChange(e)} />
                                                    </>
                                                }
                                                {data && data?.CompanyCertificate && typeof data?.CompanyCertificate === 'string' ?
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <a href={data?.CompanyCertificate} className="hover:text-yellow-300 mx-2" target="_blank" title='View Document'>
                                                            <i className="fa-solid fa-eye hover:text-yellow-300" />
                                                        </a>
                                                        |
                                                        <a id="CompanyCertificate" className="hover:text-red-500 cursor-pointer mx-2" onClick={(e) => handleDeleteDocument(e)} title='Delete Document'>
                                                            <i className="fa-solid fa-trash-can hover:text-red-500 cursor-pointer" id="CompanyCertificate" />
                                                        </a>
                                                    </div>
                                                    :
                                                    ""
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                    {/* 2 */}
                                    <tr>
                                        <td className='text-center'>2</td>
                                        <td>
                                            <p className='text-sm'>GST Registration Certificate</p>
                                        </td>
                                        <td className='text-center'>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="me-3 text-sm font-medium text-gray-50">No</span>
                                                <label className="inline-flex relative items-center cursor-pointer">
                                                    <input type="checkbox" name='GSTCertificate' disabled={typeof data?.GSTCertificate === "string"} checked={data?.GSTCertificate} onChange={(e) => setData({ ...data, [e.target.name]: e.target.checked })} className="sr-only peer" />
                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-50">Yes</span>
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                {load && load?.GSTCertificate ? <div className='ms-4'> <SmallSpinner loader={load && load?.GSTCertificate} /></div> :
                                                    <>
                                                        <button className={typeof data?.GSTCertificate === 'string' ? 'd-none' : 'w-75 btn btn-primary text-sm rounded-lg disabled:bg-blue-500 w-50'} name="GSTCertificate" disabled={data?.GSTCertificate == undefined || data?.GSTCertificate == false} onClick={(e) => handleButton(e)}>Upload</button>
                                                        <input className='d-none' name='GSTCertificateID' type="file" onChange={(e) => handleChange(e)} />
                                                    </>
                                                }
                                                {data && data?.GSTCertificate && typeof data?.GSTCertificate === 'string' ?
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <a href={data?.GSTCertificate} className="hover:text-yellow-300 mx-2" target="_blank" title='View Document'>
                                                            <i className="fa-solid fa-eye hover:text-yellow-300" />
                                                        </a>
                                                        |
                                                        <a id="GSTCertificate" className="hover:text-red-500 cursor-pointer mx-2" onClick={(e) => handleDeleteDocument(e)} title='Delete Document'>
                                                            <i className="fa-solid fa-trash-can hover:text-red-500 cursor-pointer" id="GSTCertificate" />
                                                        </a>
                                                    </div>
                                                    :
                                                    ""
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                    {/* 3 */}
                                    <tr>
                                        <td className='text-center'>3</td>
                                        <td>
                                            <p className='text-sm'>PAN Card  / TAN Certificate<span className="text-red-500">*</span></p>
                                        </td>
                                        <td className='text-center'>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="me-3 text-sm font-medium text-gray-50">No</span>
                                                <label className="inline-flex relative items-center cursor-pointer">
                                                    <input type="checkbox" disabled name='PANTANCard' checked={true} onChange={(e) => setData({ ...data, [e.target.name]: e.target.checked })} className="sr-only peer" />
                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-50">Yes</span>
                                                </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                {load && load?.PANTANCard ? <div className='ms-4'> <SmallSpinner loader={load && load?.PANTANCard} /> </div> :
                                                    <>
                                                        <button className={typeof data?.PANTANCard === 'string' ? 'd-none' : 'w-75 btn btn-primary text-sm rounded-lg disabled:bg-blue-500 w-50'} name="PANTANCard" onClick={(e) => handleButton(e)}>Upload</button>
                                                        <input className='d-none' name='PANTANCardID' type="file" onChange={(e) => handleChange(e)} />
                                                    </>
                                                }
                                                {data && data?.PANTANCard && typeof data?.PANTANCard === 'string' ?
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <a href={data?.PANTANCard} className="hover:text-yellow-300 mx-2" target="_blank" title='View Document'>
                                                            <i className="fa-solid fa-eye hover:text-yellow-300" />
                                                        </a>
                                                        |
                                                        <a id="PANTANCard" className="hover:text-red-500 cursor-pointer mx-2" onClick={(e) => handleDeleteDocument(e)} title='Delete Document'>
                                                            <i className="fa-solid fa-trash-can hover:text-red-500 cursor-pointer" id="PANTANCard" />
                                                        </a>
                                                    </div>
                                                    :
                                                    ""
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {userdata?.forms?.status == 0 ?
                                <div className='my-3 d-flex w-48 ml-auto'>
                                    <button onClick={(e) => handleSubmit(e)} className='btn btn-primary rounded-lg w-100'>Submit</button>
                                </div>
                                : ""}
                        </>}
                </div>
            </div>
        </div >
    )
}

export default TraineeDocumentUpload;