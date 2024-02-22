import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from "react-to-print";
import { auth, db } from '../../../firebase.config';
import { formatDate } from '../../../utils/utils';
import { Spinner } from '../../reusable/spinner/Spinner'

const ExportGST = () => {
    const [name, setname] = useState("")
    const [sign, setsign] = useState("")
    const [user, setuser] = useState()
    const [load, setLoad] = useState(true)
    const [data, setdata] = useState()

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
                setsign(_tmp?.signImage);
                setname(_tmp?.name);
                setTimeout(() => setLoad(false), 1500);
            });
            onSnapshot(doc(db, "documents", user.uid), (doc) => {
                const _tmp = doc.data()
                setsign(_tmp?.signImage);
                setTimeout(() => setLoad(false), 1500);
            });
        }
    }, [user])

    const ComponentPrint = () => {
        return (
            <div ref={pdfref} style={{ height: data?.forms?.nonapplicability === 2 ? "calc(100vh - 145px)" : "calc(100vh - 80px)", overflow: "auto", width: load ? "calc(100vw - 290px)" : "100%" }} className='scroll-hide h-full w-full rounded-lg bg-white text-black'>
                {load ?
                    <Spinner loader={load} className="dark" />
                    :
                    <div className='text-justify overflow-y-auto p-20 py-28'>
                        <p className='text-end'><b>Date: {data?.nongst?.date}</b></p>
                        <p>
                            <b>From,<br />
                                {name || "Your Name"}
                            </b>
                        </p>
                        <br />
                        <p>
                            <b>To,</b><br />
                            <p>
                                Omnicom Media Group India Private Limited<br />
                                GSTIN-{data && data?.nongst?.gstinNumber}<br />
                                {data && data?.nongst?.state}<br />
                            </p>
                        </p>
                        <br />
                        <p className='border-b-2 border-gray-900'>
                            <b>Sub:</b> Declaration regarding non-requirement for registration under the Central/ State/ Integrated Goods and Services Tax Act, 2017 (‘Act)
                        </p>
                        <br />
                        <p>
                            <b>Dear Sir/Madam,</b>
                        </p>
                        <br />
                        <p>
                            Regarding requirement of GST registration and to provide you with details of GST registrations obtained by me such as GST registration number, GST ARN and the address registered under GST.
                        </p>
                        <br />
                        <p>
                            In this connection, I hereby state that since aggregate turnover in a financial year is below prescribed limit, so I am not required to get myself registered under the Act due to the applicability of Section 22 (1) of the Act.
                        </p>
                        <br />
                        <p>
                            I request you to treat this communication as a declaration regarding non-requirement to be registered under the Act.
                        </p>
                        <br />
                        <p>
                            In case, I obtain GST registration due to change of facts or change in the law, I shall immediately inform you about such change.
                        </p>
                        <br />
                        <b>
                            Thanks and regards,<br />
                            {sign ? <img src={sign} alt="Signature" className="signImage my-2 ms-3" /> :
                                <>
                                    <br />
                                    <br />
                                    <br />
                                </>}
                            {name || "Your Name"}
                        </b>


                    </div>
                }
            </div>
        )
    };

    return (
        <>
            <div>
                <ComponentPrint />
                {data && data?.forms?.nonapplicability === 2 ? <button className='rounded-lg bg-blue-800 text-white w-full p-2 my-3' onClick={handlePrint}>Print</button> : ""}
            </div>
        </>
    )


}

export default ExportGST