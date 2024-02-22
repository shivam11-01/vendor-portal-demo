import axios from 'axios';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, updateProfile } from 'firebase/auth';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db, introauth } from '../../firebase.config';
import { BASE_URL, BASE_URL_LOCAL, setDocument } from '../../utils/api';
import { showToast } from '../../utils/toast';
import { generateUniqueID } from '../../utils/utils';
import { Input } from '../reusable/input';
import { Modal, ModalBody, ModalHeader, ModalFooter } from '../reusable/modal/modal';
import { SmallSpinner } from '../reusable/spinner/Spinner';

const InviteIntroducerModal = ({ show, onClose }) => {
    const [user, setUser] = useState()
    const [load, setload] = useState(false);
    const [inviteObj, setinviteobj] = useState({
        name: "",
        email: "",
    });

    useEffect(() => {
        onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u)
            } else {
                setUser()
            }
        });
    }, [])

    const handleInvite = async () => {
        if (inviteObj.name !== "" || inviteObj.email !== "") {
            setload(true);
            const firstName = inviteObj.name.split(" ")[0];
            const year = new Date().getFullYear()
            const password = firstName + '@' + year;
            try {
                const newuser = await createUserWithEmailAndPassword(introauth, inviteObj.email, password);
                updateProfile(introauth.currentUser, {
                    displayName: inviteObj.name,
                });
                sendEmailVerification(introauth.currentUser);
                const userdata = {
                    uid: newuser.user.uid,
                    email: inviteObj.email,
                    name: inviteObj.name,
                    nationality: "Indian",
                    userid: generateUniqueID(newuser.user.uid),
                    usertype: inviteObj.vendortype == "Trainee" ? "trainee" : "vendor",
                    vendortype: inviteObj.vendortype == "Trainee" ? "NA" : inviteObj.vendortype,
                    fpoc: user?.displayName,
                    fpocno: user?.email,
                    fpocuid: user?.uid,
                    isMT: inviteObj.vendortype == "Trainee" ? "yes" : "no",
                    forms: {
                        vendorform: 0,
                        nonapplicability: 0,
                        status: 0,
                        bankdetails: 0,
                        einvoicing: 0
                    },
                }
                await setDocument("users", newuser.user.uid, userdata);
                const vendorDetails = {
                    uid: newuser.user.uid,
                    name: inviteObj.name,
                    email: inviteObj.email,
                    userid: generateUniqueID(newuser.user.uid),
                    fpoc: user?.displayName,
                    fpocno: user?.email,
                    fpocuid: user?.uid,
                    vendortype: inviteObj.vendortype,
                    usertype: inviteObj.vendortype == "Trainee" ? "trainee" : "vendor",
                }
                await updateDoc(doc(db, "users", user.uid), {
                    invitedVendors: arrayUnion(vendorDetails)
                })
                const payload = {
                    name: inviteObj.name,
                    email: inviteObj.email,
                    password: password,
                    usertype: inviteObj.vendortype
                }
                axios.post(`${BASE_URL}/api/mail/createuser`, payload)
                    .catch((err) => {
                        console.log('Mail not send' + err);
                        showToast("warning", err);
                        setload(false);
                    })
                showToast("success", `Login Credentials send to ${inviteObj.email}`);
                setload(false);
                onClose();
            } catch (err) {
                console.log(err.message);
                showToast('warning', err.message);
                setload(false);
            }
        }
    };

    return (
        <>
            {show ? (
                <>
                    <Modal>
                        <ModalHeader close={onClose}>
                            Invite
                        </ModalHeader>
                        <ModalBody>
                            <div className="block">
                                <p className="text-gray-400">Note: The User will receive a mail with the credentials to login and a Verification Email for security reasons, if mail is not in Primary Label then ask them to check in Spam folder</p>
                                <div className="p-2">
                                    <Input
                                        inputName="name"
                                        label="Name"
                                        onChange={(e) => setinviteobj({ ...inviteObj, [e.target.name]: e.target.value })}
                                        placeholder="Enter Name"
                                        required
                                    />

                                    <Input
                                        inputName="email"
                                        label="Email"
                                        onChange={(e) => setinviteobj({ ...inviteObj, [e.target.name]: e.target.value })}
                                        placeholder="Enter Email"
                                        type="email"
                                        required
                                    />
                                    <div className="col-12 mb-1 text-wrap" style={{ wordBreak: "break-word" }}>
                                        <label className="text-white mb-2">Type</label>
                                        <select
                                            onChange={(e) => {
                                                setinviteobj({
                                                    ...inviteObj,
                                                    vendortype: e.target.value,
                                                });
                                            }}
                                            value={inviteObj?.vendortype}
                                            className="bg-gray-500 shadow-none border-none text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Select Type</option>
                                            <option value="Trainee">Trainee</option>
                                            <option value="Overhead">Overhead</option>
                                            <option value="Digital">Digital</option>
                                            <option value="Non-Digital">Non-Digital</option>
                                            <option value="Content">Content</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <>
                                <button
                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                                <button
                                    className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                    onClick={handleInvite}
                                    disabled={inviteObj.name == "" || inviteObj.email == ""}
                                >
                                    {load ? <SmallSpinner loader={load} /> : "Invite"}
                                </button>
                            </>
                        </ModalFooter>
                    </Modal>
                </>
            ) : null}

        </>
    )
}

export default InviteIntroducerModal