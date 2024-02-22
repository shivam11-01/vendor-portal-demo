import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from '../../firebase.config';
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { Spinner } from '../reusable/spinner/Spinner';
import { Link } from 'react-router-dom';
import { epochToTimestamp, getStatusIcon } from '../../utils/utils';
import { updateDocument } from '../../utils/api';
import ReusableModal from '../reusable/modal/reusablemodal';
import { showToast } from '../../utils/toast';

const Queries = () => {
    const [user, setUser] = useState()
    const [data, setData] = useState()
    const [load, setLoad] = useState(true);
    const [cnfm, setcnfm] = useState(false);
    const [recall, setrecall] = useState(false);
    const queryTitle = useRef();
    const querytype = useRef();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser()
            }
        });
    }, [])

    const fetchData = () => {
        if (user) {
            onSnapshot(doc(db, "users", user.uid), (doc) => {
                const _tmp = doc.data()
                setData(_tmp);
                setLoad(false);
            });
        }
    }

    useEffect(() => {
        fetchData();
    }, [user])

    const handleChangeStatus = async () => {
        const { current } = querytype;
        console.log(current);
        data && data?.queries[current]?.length > 0 && data?.queries[current]?.map((query, index) => {
            if (query.title == queryTitle.current) {
                data.queries[current][index].status = 1;
                return;
            }
        });
        console.log(data?.queries[current]);
        if (current === "general") {
            await updateDocument("users", user.uid, { "queries.general": data?.queries[current] });
            showToast("success", "Query Resolved and Submitted Successfully!");
            fetchData();
            setrecall(false);
            window.location.reload();
        }
        if (current === "msa") {
            await updateDocument("users", user.uid, { "queries.msa": data?.queries[current] });
            showToast("success", "Query Resolved and Submitted Successfully!");
            fetchData();
            setrecall(false);
            window.location.reload();
        }
        if (current === "bank") {
            await updateDocument("users", user.uid, { "queries.bank": data?.queries[current] });
            showToast("success", "Query Resolved and Submitted Successfully!");
            fetchData();
            setrecall(false);
            window.location.reload();
        }
        if (current === "einvoicing") {
            await updateDocument("users", user.uid, { "queries.einvoicing": data?.queries[current] });
            showToast("success", "Query Resolved and Submitted Successfully!");
            fetchData();
            setrecall(false);
            window.location.reload();
        }
        if (current === "nongst") {
            await updateDocument("users", user.uid, { "queries.nongst": data?.queries[current] });
            showToast("success", "Query Resolved and Submitted Successfully!");
            fetchData();
            setrecall(false);
            window.location.reload();
        }
        if (current === "vendorform") {
            await updateDocument("users", user.uid, { "queries.vendorform": data?.queries[current] });
            showToast("success", "Query Resolved and Submitted Successfully!");
            fetchData();
            setrecall(false);
            window.location.reload();
        }
    }

    useEffect(() => {
        if (recall && data && data?.queries[querytype.current].length > 0) {
            handleChangeStatus();
            fetchData();
        }
    }, [recall === true])

    return (
        <>
            <div className='p-4 w-full h-full rounded-lg border-gray-800 shadow-md glass' style={{ height: "calc(100vh - 80px)" }}>
                <div className="p-3 pt-0">
                    <div className='p-3 text-white text-center h3 border-bottom border-secondary break-all'>Queries</div>
                    <div className='row text-white p-2 justify-between border rounded-xl'>
                        {load ?
                            <Spinner loader={load} />
                            :
                            <>
                                {data?.queries == {} || data?.queries == undefined &&
                                    <div className='col-12'>
                                        <p className="text-center py-4 text-gray-400">No Queries Found</p>
                                    </div>
                                }
                                {data?.queries?.general && data?.queries?.general.length > 0 &&
                                    <div className='col-6 mb-3'>
                                        <p className="h6 mb-1 py-2 text-center border-b">
                                            <Link className="hover:text-gray-300" title="Open Profile" to="/profile">General Queries</Link>
                                        </p>
                                        <p className="text-start overflow-auto rounded-lg p-2 max-h-60 text-gray-400 flex flex-col-reverse">{data?.queries?.general ? data?.queries?.general.map((query) => (
                                            <>
                                                <div
                                                    onClick={() => {
                                                        if (query.status === 0) {
                                                            querytype.current = "general";
                                                            queryTitle.current = query.title;
                                                            setcnfm(true);
                                                        }
                                                    }}
                                                    title={query.status === 0 ? "Click to change status" : "Query resolved and Submitted"}
                                                    className={query.status === 0 ? "cursor-pointer text-gray-200 rounded-md mb-2 bg-gray-500 px-3 text-sm py-1 hover:text-gray-100 hover:bg-slate-500" : "text-gray-200 rounded-md mb-2 bg-gray-500 px-3 text-sm py-1 hover:text-gray-100 hover:bg-slate-500"}>
                                                    <p className='break-all'>{query.title}</p>
                                                    <p className="text-end">
                                                        <small className="w-full text-xs text-gray-300">
                                                            {epochToTimestamp(query.timestamp)}
                                                            <i className={`${getStatusIcon(query.status)}`} />
                                                        </small>
                                                    </p>
                                                </div>
                                            </>
                                        )) : ""}
                                        </p>
                                    </div>
                                }
                                {data?.queries?.msa && data?.queries?.msa.length > 0 &&
                                    <div className='col-6 mb-3'>
                                        <p className="h6 mb-1 py-2 text-center border-b">
                                            <Link className="hover:text-gray-200" title="Open NDA" to="/exportmsa">MSA Queries</Link>
                                        </p>
                                        <p className="text-start overflow-auto rounded-lg p-2 max-h-60 text-gray-400 flex flex-col-reverse">{data?.queries?.msa ? data?.queries?.msa.map((query) => (
                                            <>
                                                <div
                                                    onClick={() => {
                                                        if (query.status === 0) {
                                                            querytype.current = "msa";
                                                            queryTitle.current = query.title;
                                                            setcnfm(true);
                                                        }
                                                    }}
                                                    title={query.status === 0 ? "Click to change status" : "Query resolved and Submitted"}
                                                    className={query.status === 0 ? "cursor-pointer text-gray-200 rounded-md mb-2 bg-gray-500 px-3 text-sm py-1 hover:text-gray-100 hover:bg-slate-500" : "text-gray-200 rounded-md mb-2 bg-gray-500 px-3 text-sm py-1 hover:text-gray-100 hover:bg-slate-500"}>
                                                    <p className='break-all'>{query.title}</p>
                                                    <p className="text-end">
                                                        <small className="w-full text-xs text-gray-300">
                                                            {epochToTimestamp(query.timestamp)}
                                                            <i className={`${getStatusIcon(query.status)}`} />
                                                        </small>
                                                    </p>
                                                </div>
                                            </>
                                        )) : ""}
                                        </p>
                                    </div>
                                }
                                {data?.queries?.bank && data?.queries?.bank.length > 0 &&
                                    <div className='col-6 mb-3'>
                                        <p className="h6 mb-1 py-2 text-center border-b">
                                            <Link className="hover:text-gray-200" title="Open Bank Details" to="/vendor-bankdetails">Bank Queries</Link>
                                        </p>
                                        <p className="text-start overflow-auto rounded-lg p-2 max-h-60 text-gray-400 flex flex-col-reverse">{data?.queries?.bank ? data?.queries?.bank.map((query) => (
                                            <>
                                                <div
                                                    onClick={() => {
                                                        if (query.status === 0) {
                                                            querytype.current = "bank";
                                                            queryTitle.current = query.title;
                                                            setcnfm(true);
                                                        }
                                                    }}
                                                    title={query.status === 0 ? "Click to change status" : "Query resolved and Submitted"}
                                                    className={query.status === 0 ? "cursor-pointer text-gray-200 rounded-md mb-2 bg-gray-500 px-3 text-sm py-1 hover:text-gray-100 hover:bg-slate-500" : "text-gray-200 rounded-md mb-2 bg-gray-500 px-3 text-sm py-1 hover:text-gray-100 hover:bg-slate-500"}>
                                                    <p className='break-all'>{query.title}</p>
                                                    <p className="text-end">
                                                        <small className="w-full text-xs text-gray-300">
                                                            {epochToTimestamp(query.timestamp)}
                                                            <i className={`${getStatusIcon(query.status)}`} />
                                                        </small>
                                                    </p>
                                                </div>
                                            </>
                                        )) : ""}
                                        </p>
                                    </div>
                                }
                                {data?.queries?.vendorform && data?.queries?.vendorform.length > 0 &&
                                    <div className='col-6 mb-3'>
                                        <p className="h6 mb-1 py-2 text-center border-b">
                                            <Link className="hover:text-gray-200" title="Open Vendor Form" to="/vendor-form">Vendor Form Queries</Link>
                                        </p>
                                        <p className="text-start overflow-auto rounded-lg p-2 max-h-60 text-gray-400 flex flex-col-reverse">{data?.queries?.vendorform ? data?.queries?.vendorform.map((query) => (
                                            <>
                                                <div
                                                    onClick={() => {
                                                        if (query.status === 0) {
                                                            querytype.current = "vendorform";
                                                            queryTitle.current = query.title;
                                                            setcnfm(true);
                                                        }
                                                    }}
                                                    title={query.status === 0 ? "Click to change status" : "Query resolved and Submitted"}
                                                    className={query.status === 0 ? "cursor-pointer text-gray-200 rounded-md mb-2 bg-gray-500 px-3 text-sm py-1 hover:text-gray-100 hover:bg-slate-500" : "text-gray-200 rounded-md mb-2 bg-gray-500 px-3 text-sm py-1 hover:text-gray-100 hover:bg-slate-500"}>
                                                    <p className='break-all'>{query.title}</p>
                                                    <p className="text-end">
                                                        <small className="w-full text-xs text-gray-300">
                                                            {epochToTimestamp(query.timestamp)}
                                                            <i className={`${getStatusIcon(query.status)}`} />
                                                        </small>
                                                    </p>
                                                </div>
                                            </>
                                        )) : ""}
                                        </p>
                                    </div>
                                }
                                {data?.queries?.nongst && data?.queries?.nongst.length > 0 &&
                                    <div className='col-6 mb-3'>
                                        <p className="h6 mb-1 py-2 text-center border-b">
                                            <Link className="hover:text-gray-200" title="Open Vendor Form" to="/vendor-form">Non-Applicability of GST Queries</Link>
                                        </p>
                                        <p className="text-start overflow-auto rounded-lg p-2 max-h-60 text-gray-400 flex flex-col-reverse">{data?.queries?.nongst ? data?.queries?.nongst.map((query) => (
                                            <>
                                                <div
                                                    onClick={() => {
                                                        if (query.status === 0) {
                                                            querytype.current = "nongst";
                                                            queryTitle.current = query.title;
                                                            setcnfm(true);
                                                        }
                                                    }}
                                                    title={query.status === 0 ? "Click to change status" : "Query resolved and Submitted"}
                                                    className={query.status === 0 ? "cursor-pointer text-gray-200 rounded-md mb-2 bg-gray-500 px-3 text-sm py-1 hover:text-gray-100 hover:bg-slate-500" : "text-gray-200 rounded-md mb-2 bg-gray-500 px-3 text-sm py-1 hover:text-gray-100 hover:bg-slate-500"}>
                                                    <p className='break-all'>{query.title}</p>
                                                    <p className="text-end">
                                                        <small className="w-full text-xs text-gray-300">
                                                            {epochToTimestamp(query.timestamp)}
                                                            <i className={`${getStatusIcon(query.status)}`} />
                                                        </small>
                                                    </p>
                                                </div>
                                            </>
                                        )) : ""}
                                        </p>
                                    </div>
                                }
                                {data?.queries?.einvoicing && data?.queries?.einvoicing.length > 0 &&
                                    <div className='col-6 mb-3'>
                                        <p className="h6 mb-1 py-2 text-center border-b">
                                            <Link className="hover:text-gray-200" title="Open Vendor Form" to="/vendor-form">E-Invoicing Queries</Link>
                                        </p>
                                        <p className="text-start overflow-auto rounded-lg p-2 max-h-60 text-gray-400 flex flex-col-reverse">{data?.queries?.einvoicing ? data?.queries?.einvoicing.map((query) => (
                                            <>
                                                <div
                                                    onClick={() => {
                                                        if (query.status === 0) {
                                                            querytype.current = "einvoicing";
                                                            queryTitle.current = query.title;
                                                            setcnfm(true);
                                                        }
                                                    }}
                                                    title={query.status === 0 ? "Click to change status" : "Query resolved and Submitted"}
                                                    className={query.status === 0 ? "cursor-pointer text-gray-200 rounded-md mb-2 bg-gray-500 px-3 text-sm py-1 hover:text-gray-100 hover:bg-slate-500" : "text-gray-200 rounded-md mb-2 bg-gray-500 px-3 text-sm py-1 hover:text-gray-100 hover:bg-slate-500"}>
                                                    <p className='break-all'>{query.title}</p>
                                                    <p className="text-end">
                                                        <small className="w-full text-xs text-gray-300">
                                                            {epochToTimestamp(query.timestamp)}
                                                            <i className={`${getStatusIcon(query.status)}`} />
                                                        </small>
                                                    </p>
                                                </div>
                                            </>
                                        )) : ""}
                                        </p>
                                    </div>
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
            {cnfm ?
                <ReusableModal
                    show={cnfm}
                    recall={recall}
                    setrecall={setrecall}
                    onClose={() => setcnfm(false)}
                    title={`Query: ${queryTitle?.current}`}
                    subtitle="Changing the status as solved. Are you sure the query is resolved?"
                    confirmButton="Yes"
                    cancelButtom="No"
                />
                : ""}
        </>
    )
}

export default Queries