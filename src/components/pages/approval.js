import axios from 'axios';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../firebase.config';
import { BASE_URL, BASE_URL_LOCAL, updateDocument } from '../../utils/api';
import { showToast } from '../../utils/toast';
import { Spinner } from '../reusable/spinner/Spinner'

const Approval = () => {
    const [uid, setuid] = useState();
    const [data, setdata] = useState({});
    const [forms, setforms] = useState();
    const [approveas, setapproveas] = useState();
    const [vName, setvName] = useState();
    const [load, setload] = useState(true);
    const [flag, setflag] = useState();
    const _params = useParams();

    const handleStatus = async () => {
        console.log(data?.email, data?.fpocno);
        if (data?.email != undefined && data?.fpocno != undefined || data?.email != "" && data?.fpocno != "") {
            try {
                setload(true);
                if (approveas == "accept") {
                    await updateDocument("users", uid, { "forms.status": 4, "forms.approved": true, "approvedOn": new Date() });
                    const payload = {
                        name: vName,
                        email: data?.email,
                        introducerEmail: data?.fpocno,
                        action: approveas
                    }
                    console.log('accept', payload);
                    await axios.post(`${BASE_URL}/api/mail/welcomemail`, payload)
                        .then(async (res) => {
                            if (res && res?.data?.messageID) {
                                showToast('success', `${vName} Empanelment Done`);
                                setflag(`Onboarding mail send to ${vName}, you can close the tab.`);
                                setload(false);
                                try {
                                    let remarks = prompt("Remarks:");
                                    await updateDocument("users", uid, { "vendorRemark": remarks });
                                    window.alert("Thank You, You can close the tab");
                                    var myWindow = window.open("about:blank", "_self");
                                    myWindow.close();
                                } catch (e) {
                                    console.log(e);
                                }
                                return;
                            }
                        })
                        .catch((err) => {
                            console.log('Mail not send' + err);
                            showToast("warning", err);
                            setload(false);
                            return;
                        })
                    return;
                } else if (approveas == "acceptasexception") {
                    await updateDocument("users", uid, { "forms.status": 5, "forms.approved": true, "approvedAsExceptionOn": new Date() });
                    setflag("You can close the tab.");
                    const payload = {
                        name: vName,
                        email: data?.email,
                        introducerEmail: data?.fpocno,
                        action: approveas
                    }
                    console.log('acceptasexception', payload);
                    await axios.post(`${BASE_URL}/api/mail/welcomemail`, payload)
                        .then(async (res) => {
                            console.log(res);
                            if (res && res?.data?.messageID) {
                                showToast('success', `${vName} Empanelment Done as exception`);
                                setflag(`Onboarding mail send to ${vName}, you can close the tab.`);
                                setload(false);
                                try {
                                    let remarks = prompt("Remarks:");
                                    await updateDocument("users", uid, { "vendorRemark": remarks });
                                    window.alert("Thank You, You can close the tab");
                                    var myWindow = window.open("about:blank", "_self");
                                    myWindow.close();
                                } catch (e) {
                                    console.log(e);
                                }
                                return;
                            }
                        })
                        .catch((err) => {
                            console.log('Mail not send' + err);
                            showToast("warning", err);
                            setload(false);
                            return;
                        })
                    return;
                } else if (approveas == "deny") {
                    await updateDocument("users", uid, { "forms.status": 1, "forms.approved": false, "denyedOn": new Date() });
                    showToast('success', `${vName} Denied!`);
                    setflag("You can close the tab.");
                    const payload = {
                        name: vName,
                        email: data?.email,
                        introducerEmail: data?.fpocno,
                        action: approveas
                    }
                    console.log('deny', payload);
                    await axios.post(`${BASE_URL}/api/mail/welcomemail`, payload)
                        .then(async (res) => {
                            console.log(res);
                            if (res && res?.data?.messageID) {
                                showToast('warning', `${vName} Empanelment Denied!`);
                                setflag(`${vName} Vendor denied!`);
                                setload(false);
                                try {
                                    let remarks = prompt("Remarks:");
                                    await updateDocument("users", uid, { "vendorRemark": remarks });
                                    window.alert("Thank You, You can close the tab");
                                    var myWindow = window.open("about:blank", "_self");
                                    myWindow.close();
                                } catch (e) {
                                    console.log(e);
                                }
                                return;
                            }
                        })
                        .catch((err) => {
                            console.log('Mail not send' + err);
                            showToast("warning", err);
                            setload(false);
                            return;
                        })
                    return;
                }
            }
            catch (err) {
                console.log(err);
                setload(false);
                showToast('warning', err);
                setflag("Please contact the administrator.");
                return;
            }
        }
    };

    useEffect(() => {
        sessionStorage.clear();
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        const vendorName = urlParams.get('vendorName');
        setapproveas(action);
        setvName(vendorName)
        setuid(_params.uid);
        var _tmp;
        onSnapshot(doc(db, "users", _params.uid), (doc) => {
            _tmp = doc.data();
            setdata(_tmp);
            setforms(_tmp?.forms);
        });
    }, []);

    useEffect(() => {
        if (data && data?.email && data?.fpocno) {
            handleStatus();
        }
    }, [uid, data?.email, data?.fpocno]);

    return (
        <>
            <div className='rounded-lg text-white border-gray-800 d-flex justify-center align-items-center' style={{ height: "100vh" }}>
                {load ? <>
                    <Spinner loader={load} className="top-0" />
                    <p className="h6 pt-20 m-0">Please wait...</p>
                </> :
                    <div className="p-8 pt-0 glass">
                        <div className='p-3 text-white text-center h3 border-bottom border-secondary break-all'>Approval</div>
                        <p className="text-white text-sm mb-3">Vendor Name: <br /><p className="text-lg">{vName ? vName : "NA"}</p></p>
                        <p className="text-white text-sm mb-3">UID: <br /><p className="text-lg">{uid ? uid : "NA"}</p></p>
                        <p className="text-white text-sm mb-3">Action: <br /><p className="text-lg">{approveas ? approveas : "NA"}</p></p>
                        {flag &&
                            <div className="p-2 my-3 rounded bg-success">
                                <p className="text-white"><i className="fa-solid fa-check fa-lg mx-2" />{flag}</p>
                            </div>
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default Approval