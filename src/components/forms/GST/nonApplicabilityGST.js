import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase.config';
import { authChanged, updateDocument } from '../../../utils/api';
import { showToast } from '../../../utils/toast';
import Termsandcondition from '../../reusable/modal/termsandcondition';


const NonApplicabilityGST = () => {
    const [name, setName] = useState('Your Name');
    const [user, setuser] = useState();
    const [forms, setforms] = useState()
    const [isData, setisdata] = useState(false);
    const [edit, setedit] = useState(false);
    const navigate = useNavigate();
    const [showModal, setshowModal] = useState(false);
    const [recall, setrecall] = useState(false);
    const [nongst, setnongst] = useState({
        date: "",
        state: "",
        address: "",
        gstinNumber: ""
    })
    const states = [
        {
            companyState: "Maharashtra",
            companyAddress: "3rd Floor, Omnicom House, opp. Grand Hyatt, Santacruz East, Mumbai, Maharashtra 400055",
            gstinNumber: "27AAACR5190H1ZA"
        },
        {
            companyState: "Telangana",
            companyAddress: "Survey No. 39, 12th Floor, Meenakshi Techpark, Near Mindspace Circle, Gachibowli, Hyderabad, Telangana, 500032",
            gstinNumber: "36AAACR5190H1ZB"
        },
        {
            companyState: "Haryana",
            companyAddress: "Flat No 202 and 301, Global Business Square Bldg No 32, Sector 44, Institutional Area, Gurgaon, Haryana, 122002",
            gstinNumber: "06AAACR5190H1ZE"
        },
        {
            companyState: "Karnataka",
            companyAddress: "Second Floor, 24, Golf View Homes, Wind Tunnel Road, Murugeshpalya, Off. HAL Airport Road, Bengaluru (Bangalore) Urban,Karnataka, 560017",
            gstinNumber: "29AAACR5190H1Z6"
        },
        {
            companyState: "Tamil Nadu",
            companyAddress: "Suite No 308, Apeejay House C/o Apeejay Business Centre, 39/12Haddows Road, Nungambakkam, Chennai, Tamil Nadu, 600006",
            gstinNumber: "33AAACR5190H1ZH"
        },
    ]

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
                setforms(_tmp?.forms);
                if (_tmp?.forms?.nonapplicability == 0) {
                    setedit(false);
                    setisdata(false);
                    setnongst(_tmp?.nongst);
                    return;
                }
                setedit(true);
                setisdata(true);
                setnongst(_tmp?.nongst);
            });
        }
    }, [user]);

    useEffect(() => {
        if (nongst && nongst?.address && nongst?.date && nongst?.state && forms?.nonapplicability === 1 || forms?.nonapplicability === 2 && isData) {
            navigate("/exportgst");
        }
    }, [isData]);

    const handleStateAndAddress = (e) => {
        const cstate = e.target.value;
        const caddress = states.filter((state) => state.companyState === cstate)[0];
        setnongst({
            ...nongst,
            state: cstate,
            address: caddress.companyAddress,
            gstinNumber: caddress.gstinNumber,
        });
    }

    const handleSubmit = async () => {
        if (user && user.uid) {
            const payload = {
                date: nongst?.date,
                state: nongst?.state,
                address: nongst?.address,
                gstinNumber: nongst?.gstinNumber
            }
            await updateDocument("users", user?.uid, { "nongst": payload, "forms.nonapplicability": 1 });
            showToast('success', 'Non Aplicability of GST data Saved Successfully');
            navigate("/exportgst");
            setisdata(true);
        }
    }

    useEffect(() => {
        handleSubmit();
    }, [recall]);

    return (
        <>
            <div className='p-4 w-full h-full rounded-lg border-gray-800 glass' style={{ height: "calc(100vh - 82px)" }}>
                <h3 className='text-white p-4 text-center text-uppercase lg:text-2xl md:text-xl'>Declaration for Non applicability of GST</h3>
                <div className='p-10 lg:w-4/6 md:w-5/6 m-auto align-center rounded-lg border-gray-800 glass'>
                    <form onSubmit={(e) => { setshowModal(true); e.preventDefault(); }}>
                        <div className="mb-6">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">Name</label>
                            <input type="text" id="name" name='name' value={name} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-50 dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-300">Date</label>
                            <input type="date" onChange={(e) => setnongst({ ...nongst, date: e.target.value })} value={nongst?.date} disabled={edit} id="date" name='date' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-300">State</label>
                            <select
                                defaultValue=""
                                onChange={(e) => handleStateAndAddress(e)}
                                value={nongst?.state}
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
                        <div className="mb-6">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">Company Address</label>
                            <input type="text" id="name" name='name' value={nongst?.address} disabled={edit} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-50 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
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

export default NonApplicabilityGST