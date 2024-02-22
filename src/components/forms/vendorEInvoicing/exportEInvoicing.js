import { onAuthStateChanged } from 'firebase/auth';
import { arrayUnion, doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from "react-to-print";
import { auth, db } from '../../../firebase.config';
import { updateDocument } from '../../../utils/api';
import { showToast } from '../../../utils/toast';
import { Spinner } from '../../reusable/spinner/Spinner';

const ExportEInvoicing = () => {
    const [user, setuser] = useState()
    const [data, setdata] = useState()
    const [load, setLoad] = useState(true)
    const [sign, setSign] = useState()

    const pdfref = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => pdfref.current,
        onBeforeGetContent: () => {
            pdfref.current.style.height = "100vh";
        },
        onAfterPrint: () => {
            pdfref.current.style.height = "calc(100vh - 145px)";
        }
    });

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setuser(user)
            }
        });
    }, []);

    useEffect(() => {
        if (user) {
            onSnapshot(doc(db, "users", user.uid), (doc) => {
                const _tmp = doc.data()
                setdata(_tmp);
                setTimeout(() => setLoad(false), 1500)
            });
            onSnapshot(doc(db, "documents", user.uid), (doc) => {
                const _tmp = doc.data()
                setSign(_tmp?.signImage);
            });
        }
    }, [user])

    const ComponentPrint = () => {
        return (
            <div ref={pdfref} id="printdiv" style={{ height: data?.forms?.einvoicing === 0 || data?.forms?.einvoicing === 2 ? "calc(100vh - 145px)" : "calc(100vh - 80px)", overflow: "auto", width: load ? "calc(100vw - 290px)" : "100%" }} className='scroll-hide h-full w-full rounded-lg  bg-white text-black'>
                {load ?
                    <Spinner loader={load} className="dark" />
                    :
                    <div className='text-justify overflow-y-auto p-20 pt-28'>
                        <p className='text-center'>
                            <b><u>To whomsoever it may concern</u></b>
                        </p>
                        <br />
                        <p>
                            We <b>Mr. {data?.name || "Your Name"}</b> having PAN <b>{data?.pancard || "Your PAN Card"}</b> hereby undertake that our Aggregate Turnover (as per Section 2(6) of Central Goods and Services Tax Act, 2017) for the last Financial Year does not exceed the prescribed threshold for generation a Unique Invoice Registration Number (IRN) and QR code as per the provisions of Central Goods and Services Tax Act, 2017 and rules thereunder (“GST Law”).
                        </p>
                        <br />
                        <p>
                            We hereby also undertake that if the aggregate turnover of mine, <b>Mr. {data?.name || "Your Name"}</b> exceeds the current threshold or revised threshold notified by Government of India at any future date for e-invoicing provisions, then we shall issue invoice and credit/ debit note in compliance with the required provisions of GST Law.
                        </p>
                        <br />
                        <p>
                            In case of any queries from the any state or center Goods and Services Tax authorities, <b>Mr. {data?.name || "Your Name"}</b> will be solely responsible for non-compliance of e-invoicing provisions laid down under GST law.
                        </p>
                        <br />
                        <p>
                            We accordingly confirm that the above statements are true and correct and would continue to indemnify Omnicom Media Group India Private Limited to whom we have made supplies for any loss caused, due to any infirmity caused to them in this regard.
                        </p>
                        <br />
                        <br />
                        <p>Yours Truly,</p>
                        <b>
                            Mr. {data?.name || "Your Name"}
                        </b>
                        {sign ? <img src={sign} alt="Signature" className="signImage my-2 ms-3" /> :
                            <>
                                <br />
                                <br />
                                <br />
                            </>}
                        <p>Authorized Signatory</p>
                        <p>Name: <b>{data?.name || "Your Name"}</b></p>
                        <p>Designation: <b>{data?.designation}</b></p>

                    </div>
                }
            </div>
        )
    };

    const handleSubmit = async () => {
        if (user && user.uid && data?.pancard && data?.name) {
            await updateDocument("users", user.uid, { "forms.einvoicing": 1 });
            const currentDate = Date.now();
            const log = {
                title: `${user.displayName} submitted E-Invoicing`,
                timestamp: currentDate,
            }
            await updateDocument("users", user.uid, {
                "logs": arrayUnion(log),
            });
            showToast("success", "Einvoicing data saved");
        } else {
            showToast("warning", "Please complete your profile to submit this section");
        }
    }

    return (
        <>
            <div>
                <ComponentPrint />
                {data?.forms?.einvoicing === 0 &&
                    <button className='rounded-lg bg-blue-800 text-white w-full p-2 my-3 disabled:opacity-50' disabled={data?.forms?.einvoicing === 1} onClick={handleSubmit}>{data?.forms?.einvoicing === 1 ? "Submitted" : "Submit"}</button>
                }
                {data?.forms?.einvoicing === 2 &&
                    <button id="printbtn" className='rounded-lg bg-blue-800 text-white w-full p-2 my-3' onClick={handlePrint}>Print</button>
                }
            </div>
        </>
    )


}

export default ExportEInvoicing