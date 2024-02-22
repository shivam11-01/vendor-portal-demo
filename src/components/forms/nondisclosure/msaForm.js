import { onAuthStateChanged } from 'firebase/auth';
import { arrayUnion, doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase.config';
import { authChanged, updateDocument } from '../../../utils/api';
import { showToast } from '../../../utils/toast';
import { states } from '../../../utils/utils';
import Termsandcondition from '../../reusable/modal/termsandcondition';


const MSAForm = () => {
    const [name, setName] = useState('Your Name');
    const [data, setdata] = useState();
    const [user, setuser] = useState();
    const [forms, setforms] = useState();
    const [edit, setedit] = useState(false);
    const [isData, setisdata] = useState(false);
    const navigate = useNavigate()
    const [showModal, setshowModal] = useState(false);
    const [recall, setrecall] = useState(false);
    const [msa, setmsa] = useState({
        date: "",
        state: "",
        address: "",
        gstinNumber: "",
        division: "",
        cinnumber: ""
    })

    useEffect(() => {
        onAuthStateChanged(auth, (u) => {
            if (u) {
                setName(u.displayName)
                setuser(u)
            }
        });
    }, []);

    useEffect(() => {
        if (user) {
            onSnapshot(doc(db, "users", user.uid), (doc) => {
                const _tmp = doc.data();
                setdata(_tmp);
                setforms(_tmp?.forms);
                if (_tmp?.forms?.msa == 0) {
                    setedit(false);
                    setisdata(false);
                    setmsa(_tmp?.msa);
                    return;
                }
                setedit(true);
                setisdata(true);
                setmsa(_tmp?.msa);
            });
        }
    }, [user]);


    const handleStateAndAddress = (e) => {
        const cstate = e.target.value;
        const caddress = states.filter((state) => state.companyState === cstate)[0];
        setmsa({
            ...msa,
            state: cstate,
            address: caddress.companyAddress,
            gstinNumber: caddress.gstinNumber,
        });
    }

    const handleSubmit = async () => {
        if (user && user.uid) {
            const payload = {
                date: msa?.date,
                state: msa?.state,
                address: msa?.address,
                gstinNumber: msa?.gstinNumber,
                division: msa?.division,
                cinnumber: msa?.cinnumber
            }
            await updateDocument("users", user?.uid, { "msa": payload, "forms.msa": 1 });
            const currentDate = Date.now();
            const log = {
                title: `${user.displayName} submitted MSA Form`,
                timestamp: currentDate,
            }
            await updateDocument("users", user?.uid, {
                "logs": arrayUnion(log),
            });
            showToast('success', 'Master Service Agreement data Saved Successfully');
            navigate("/exportmsa");
            setisdata(true);
        }
    }

    // const handleCIN = (e) => {
    //     let regexp = /^([L|U]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/;
    //     let cin = e.target.value.toUpperCase();
    //     setmsa({
    //         ...msa,
    //         cinnumber: cin
    //     });
    //     if (cin.length == 21) {
    //         if (regexp.test(cin)) {
    //             seterror("");
    //         } else {
    //             setmsa({
    //                 ...msa,
    //                 cinnumber: ""
    //             })
    //             seterror("Enter Valid CIN Number!")
    //         }
    //     }
    // }

    useEffect(() => {
        if (msa && msa?.address && msa?.date && msa?.state && msa?.cinnumber && msa?.division && forms?.msa === 1 || forms?.msa === 2 && isData) {
            navigate("/exportmsa");
        }
    }, [isData]);

    useEffect(() => {
        handleSubmit();
    }, [recall]);

    return (
        <>
            <div className='p-4 w-full h-full rounded-lg border-gray-800 glass' style={{ height: "calc(100vh - 82px)" }}>
                <h3 className='text-white p-4 text-center text-uppercase lg:text-2xl md:text-xl'>Declaration for Master Service Agreement</h3>
                <div className='p-10 lg:w-4/6 md:w-5/6 m-auto align-center rounded-lg border-gray-800 glass'>
                    <form onSubmit={(e) => { setshowModal(true); e.preventDefault(); }}>
                        <div className="row">
                            <div className="col-6 mb-6">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">Name</label>
                                <input type="text" id="name" name='name' value={name} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-50 dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled />
                            </div>
                            <div className="col-6 mb-6">
                                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-300">Date</label>
                                <input type="date" onChange={(e) => setmsa({ ...msa, date: e.target.value })} value={msa?.date} disabled={edit} id="date" name='date' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className="col-6 mb-6">
                                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-300">Division</label>
                                <input type="text" onChange={(e) => setmsa({ ...msa, division: e.target.value })} value={msa?.division} disabled={edit} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className="col-6 mb-6">
                                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-300">Your CIN Number</label>
                                <input type="text" onChange={(e) => setmsa({ ...msa, cinnumber: e.target.value })} value={msa?.cinnumber} disabled={edit} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <div className="col-6 mb-6">
                                <label className="block mb-2 text-sm font-medium text-gray-300">State</label>
                                <select
                                    defaultValue=""
                                    onChange={(e) => handleStateAndAddress(e)}
                                    value={msa?.state}
                                    className="form-select bg-gray-500 shadow-none border-none text-gray-50 text-sm rounded-lg block w-full p-2.5 disabled:text-black placeholder-gray-700 disabled:opacity-50"
                                    aria-label="Default select"
                                    required
                                    disabled={edit}
                                >
                                    <option selected value="" disabled>Select</option>
                                    {states.map((state) => (
                                        <option name={state.companyAddress} value={state.companyState}>{state.companyState}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-6 mb-6">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">Company Address</label>
                                <input type="text" id="name" name='name' value={msa?.address} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-50 dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled />
                            </div>
                        </div>
                        <div className=''>
                            <button type='submit' className='rounded-lg bg-blue-800 text-white w-full p-2'>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <Termsandcondition
                title="Are you sure you want to submit it?"
                subtitle="I hereby declare that all the information given above is true and correct to the best of my knowledge"
                show={showModal}
                setrecall={setrecall}
                onClose={() => setshowModal(false)}
            />
        </>
    )
}

export default MSAForm