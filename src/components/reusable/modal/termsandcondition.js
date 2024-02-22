import axios from 'axios';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, updateProfile } from 'firebase/auth';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db, introauth } from '../../../firebase.config';
import { BASE_URL, setDocument } from '../../../utils/api';
import { showToast } from '../../../utils/toast';
import { generateUniqueID } from '../../../utils/utils';
import { Input } from '../../reusable/input';
import { Modal, ModalBody, ModalHeader, ModalFooter } from '../../reusable/modal/modal';
import { SmallSpinner } from '../../reusable/spinner/Spinner';


const Termsandcondition = ({ show, onClose, setrecall, title, subtitle }) => {

    return (
        <>
            {show ? (
                <>
                    <Modal>
                        <ModalHeader close={onClose}>
                            <div className='text-white text-2xl'>
                                Note
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div className="block">
                                <p className="text-white text-lg">{title}</p>
                                <p className="text-gray-400 text-sm mt-3 ">{subtitle}</p>
                                <div className="p-2">

                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <>
                                <div className='-mt-3'>
                                    <button
                                        className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                        onClick={() => {
                                            setrecall(true);
                                            onClose();
                                        }}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </>
                        </ModalFooter>
                    </Modal>
                </>
            ) : null}

        </>
    )
}

export default Termsandcondition