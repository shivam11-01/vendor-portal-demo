import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase.config';

const VendorEInvoicing = () => {
    const [user, setuser] = useState()
    const [data, setdata] = useState({})
    const [desgination, setdesgination] = useState("")
    const [error, seterror] = useState("")

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
                setdata(doc.data());
            });
        }
    }, [user])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (desgination == "") {
            seterror("Enter Designation to continue!")
        }
        if (desgination && error == "") {
            window.location.href = `/exporteinvoicing?_designation=${desgination}`;
        }
    };

    return (
        <>
            <div className='p-4 w-full h-full rounded-lg border-gray-800 glass' style={{ height: "calc(100vh - 82px)" }}>
                <h3 className='text-white p-4 text-center text-uppercase lg:text-2xl md:text-xl'>E-Invoicing</h3>
                <div className='p-10 lg:w-4/6 md:w-5/6 m-auto align-center rounded-lg border-gray-800 glass'>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-300">Name</label>
                            <input
                                type="text"
                                value={data?.name || "Your Name"}
                                disabled={data?.name}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-50 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-300">PAN Number</label>
                            <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-50 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={data?.pancard || "Your PAN Card"}
                                disabled={data?.pancard}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-300">Designation</label>
                            <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-50 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => setdesgination(e.target.value)}
                                value={desgination}
                                required
                            />
                            <p className="text-red-500 text-sm pt-2">{error}</p>
                        </div>
                        <button type='submit' className='rounded-lg bg-blue-800 text-white w-full p-2'>Submit</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default VendorEInvoicing