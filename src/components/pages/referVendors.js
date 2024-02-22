import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase.config';
import { isEmpty } from '../../utils/utils';
import DataTable, { createTheme } from 'react-data-table-component';
import InviteIntroducerModal from './inviteVendorsModal';
import { Spinner } from '../reusable/spinner/Spinner';
import { doc, onSnapshot } from 'firebase/firestore';

const ReferVendors = () => {
    const [user, setUser] = useState()
    const [invited, setinvited] = useState([]);
    const [load, setLoad] = useState(true);
    const [showModal, setshowmodal] = useState(false)

    useEffect(() => {
        onAuthStateChanged(auth, (User) => {
            if (User) {
                setUser(User)
            } else {
                setUser()
            }
        });
    }, [])

    useEffect(() => {
        if (user) {
            onSnapshot(doc(db, "users", user.uid), (doc) => {
                const _tmp = doc.data()
                setinvited(_tmp?.invitedVendors)
            });
            setLoad(false)
        }
    }, [user])

    createTheme('solarized', {
        text: {
            primary: '#FFFFFF',
        },
        background: {
            default: 'rgba(255, 255, 255, 0.07)',
        },
    });

    const customStyles = {
        headCells: {
            style: {
                fontSize: '16px',
            },
        },
    };

    const columns = [
        {
            name: 'User ID',
            selector: row => row.userid,
            sortable: true,
            width: '130px',
            style: {
                '&:hover': {
                    cursor: 'pointer',
                },
            }
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            width: '300px',
            style: {
                '&:hover': {
                    cursor: 'pointer',
                },
            }
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            style: {
                '&:hover': {
                    cursor: 'pointer',
                },
            }
        },
    ];

    return (
        <>
            <div className='p-4 w-full h-full rounded-lg border-gray-800 shadow-md glass' style={{ height: "calc(100vh - 82px)" }}>
                <div className='text-white h1 break-all'>Refer Vendors</div>
                <div className="d-flex justify-content-end align-items-center pb-2">
                    <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-white d-flex align-items-center" onClick={() => setshowmodal(true)}>
                        <i className="fa-solid fa-plus" />
                        <p className="mx-2">Invite Vendors</p>
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={invited}
                    responsive
                    highlightOnHover
                    fixedHeader
                    theme="solarized"
                    customStyles={customStyles}
                    progressPending={load}
                    progressComponent={<Spinner className="m-5 no-left" loader={true} />}
                    fixedHeaderScrollHeight="500px"
                />
            </div>
            <InviteIntroducerModal
                show={showModal}
                onClose={() => setshowmodal(false)}
            />
        </>
    )
}

export default ReferVendors;