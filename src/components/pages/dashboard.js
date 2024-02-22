import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase.config";
import DataTable, { createTheme } from "react-data-table-component";
import { getStatus } from "../../utils/utils";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { Spinner } from "../reusable/spinner/Spinner";
import InviteIntroducerModal from "./inviteVendorsModal";
import { updateDocument } from "../../utils/api";
import { utils, writeFile } from 'xlsx';

const Dashboard = () => {
  const [user, setUser] = useState();
  const [data, setdata] = useState();
  const [allusers, setallusers] = useState();
  const [status, setstatus] = useState({})
  const [invited, setinvited] = useState([]);
  const [masterinvited, setmasterinvited] = useState([]);
  const [load, setLoad] = useState(true);
  const [showModal, setshowmodal] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (User) => {
      if (User) {
        setUser(User);
      } else {
        setUser();
      }
      let userlist;
      const docRef = collection(db, "users");
      onSnapshot(docRef, (docsSnap) => {
        userlist = [];
        docsSnap.forEach(doc => {
          userlist.push(doc.data());
          userlist = userlist.filter((ul) => ul.usertype === "vendor" || ul.usertype === "trainee" && User.uid === ul.fpocuid);
          if (userlist.length > 0) setallusers(userlist);
        })
      });
    });


  }, []);

  useEffect(() => {
    if (user) {
      onSnapshot(doc(db, "users", user.uid), (doc) => {
        const _tmp = doc.data();
        setdata(_tmp);
        setinvited(_tmp?.invitedVendors);
        setmasterinvited(_tmp?.invitedVendors);
        setstatus(_tmp?.forms);
      });
      setLoad(false);
    }
  }, [user]);

  const rows = [
    {
      id: 1,
      name: "Non-applicability of GST",
      status: status?.nonapplicability,
      isApplicable: data?.isGSTApplicable,
    },
    {
      id: 2,
      name: "Vendor Data Form",
      status: status?.vendorform,
      isApplicable: ""
    },
    {
      id: 3,
      name: "Vendor E-Invoicing",
      status: status?.einvoicing,
      isApplicable: data?.isEinvoicingApplicable,
    },
    {
      id: 4,
      name: "Vendor Bank Details",
      status: status?.bankdetails,
      isApplicable: ""
    },
    {
      id: 5,
      name: "Vendor MSA",
      status: status?.msa,
      isApplicable: data?.isMT == "yes" ? "" : "yes"
    },
  ];

  const columns = [
    {
      name: "Sr. No.",
      selector: (row) => row.id,
      sortable: true,
      width: "105px",
    },
    {
      name: "Form Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => getStatus(row.status, row.isApplicable),
      sortable: true,
    },
  ];

  const invitedColumns = [
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
      name: 'Type',
      selector: row => row.vendortype ? row.vendortype : "-",
      sortable: true,
      width: '180px',
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
      width: '250px',
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
    {
      name: 'Status',
      selector: row => getFormsStatus(row.uid),
      sortable: true,
      width: '200px',
      style: {
        '&:hover': {
          cursor: 'pointer',
        },
      }
    },
  ];

  createTheme("solarized", {
    text: {
      primary: "#FFFFFF",
    },
    background: {
      default: "rgba(255, 255, 255, 0.07)",
    },
  });

  const customStyles = {
    headCells: {
      style: {
        fontSize: "16px",
        backgroundColor: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(15px)",
        color: "black",
        borderRadiusTopLeft: "10px",
      },
    },
  };

  const getFormsStatus = (uid) => {
    let details = {};
    if (allusers) {
      details = allusers && allusers?.filter((user) => user?.uid === uid)[0];
    }
    if (details && details?.forms !== undefined) {
      const { forms } = details;
      if (forms?.status === 0) {
        return "Forms Pending";
      }
      if (forms?.status === 1) {
        return "Forms Submitted";
      }
      if (forms?.status === 2) {
        return "Forms Validated";
      }
      if (forms?.status === 3) {
        return "Sent for Approval";
      }
      if (forms?.status === 4) {
        return "Approved";
      }
      if (forms?.status === 5) {
        return "Approved as Exception";
      }
    } else {
      return "Forms not Submitted by Vendor";
    }
  };

  const setVendorStatus = async () => {
    if (
      (data?.forms?.status == 0 &&
        data?.forms?.bankdetails == 1 &&
        data?.forms?.vendorform == 1 &&
        data?.isEinvoicingApplicable == "no" &&
        data?.forms?.einvoicing == 1) ||
      (data?.isGSTApplicable == "no" && data?.forms?.nonapplicability == 1) ||
      (data?.vendortype != "Overhead" && data?.forms?.msa == 1)
    ) {
      await updateDocument("users", user.uid, { "forms.status": 1 });
    }
  };

  useEffect(() => {
    setVendorStatus();
  }, [user, data?.forms]);

  const handleExportData = () => {
    console.log(invited);
    var list = [];
    for (var i = 0; i < invited.length; i++) {
      let dump = {
        userid: invited[i].userid,
        name: invited[i].name,
        email: invited[i].email,
        type: invited[i].vendortype,
        introducerName: invited[i].fpoc,
        introducerEmail: invited[i].fpocno,
        empanelmentStatus: getFormsStatus(invited[i].uid),
      };
      list.push(dump);
    }
    var wb = utils.book_new(),
      ws = utils.json_to_sheet(list);
    utils.book_append_sheet(wb, ws, "Invited Users");
    writeFile(wb, "Invited Users List.xlsx");
  };

  const handleChangeUsertype = (key) => {
    if (key == "" || key == "all") {
      console.log(masterinvited);
      setinvited(masterinvited);
      return;
    }
    if (key) {
      let filtered = masterinvited.filter((inv) => inv.vendortype === key);
      setinvited(filtered);
      return;
    }
  };

  const handleStatusFIlter = (key) => {
    console.log(key);
    var details =
      allusers &&
      allusers?.filter(
        (user) => user?.fpocuid === data?.uid && user?.forms?.status == key
      );
    var tmp = masterinvited.filter((mi) => {
      return;
    });
    console.log(details);
  };

  const handleSearch = (search) => {
    if (search === "") {
      setinvited(masterinvited);
    } else {
      const filteredList = invited.filter((user) => {
        return (
          user?.name?.toLowerCase().indexOf(search?.toLowerCase()) > -1 ||
          user?.email?.toLowerCase().indexOf(search?.toLowerCase()) > -1 ||
          user?.userid?.toLowerCase().indexOf(search?.toLowerCase()) > -1 ||
          user?.vendortype?.toLowerCase().indexOf(search?.toLowerCase()) > -1
        );
      });
      setinvited(filteredList);
    }
  };

  return (
    <>
      <div
        className="p-4 w-full h-full rounded-lg border-gray-800 shadow-md glass"
        style={{ height: "calc(100vh - 82px)" }}
      >
        <div className="text-white h1 break-all">Dashboard</div>
        {data?.forms?.approved && (
          <div class="alert alert-success" role="alert">
            Welcome Onboard, {data?.name}! Your Verification is Successful
          </div>
        )}
        <span
          className={
            !user?.emailVerified
              ? "bg-gray-100 text-gray-800 text-xl font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2 dark:bg-gray-700 dark:text-gray-300"
              : "d-none"
          }
        >
          <svg
            aria-hidden="true"
            className="mr-1 w-3=5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            ></path>
          </svg>
          Email Verification is pending...
        </span>
        {
          // user?.emailVerified &&
          data?.usertype === "vendor" ? (
            <DataTable
              columns={columns}
              data={rows}
              responsive
              highlightOnHover
              fixedHeader
              theme="solarized"
              customStyles={customStyles}
              fixedHeaderScrollHeight="500px"
            />
          ) : (
            ""
          )
        }
        {
          // user?.emailVerified &&
          data?.usertype === "introducer" ? (
            <>
              <div className="d-flex justify-content-between align-items-center pb-2">
                <div className="d-flex justify-content-start align-items-center">
                  {/* <select
                  className="me-2 text-gray-50 bg-gray-500 shadow-none border-none text-sm rounded-lg outline-none block w-44 p-2.5 placeholder-gray-700"
                  onChange={(e) => handleStatusFIlter(e.target.value)}
                >
                  <option selected value="">Choose Status</option>
                  <option value={0}>Forms Pending</option>
                  <option value={1}>Forms Submitted</option>
                  <option value={2}>Forms Validated</option>
                  <option value={3}>Sent for Approval</option>
                  <option value={4}>Approved</option>
                  <option value={5}>Approved as Exception</option>
                </select> */}
                <select
                  className="me-2 text-gray-50 bg-gray-500 shadow-none border-none text-sm rounded-lg outline-none block w-44 p-2.5 placeholder-gray-700"
                  onChange={(e) => handleChangeUsertype(e.target.value)}
                >
                  <option selected value="">Choose Type</option>
                  <option value="all">All</option>
                  <option value="Trainee">Trainee</option>
                  <option value="Overhead">Overhead</option>
                  <option value="Digital">Digital</option>
                  <option value="Non-Digital">Non-Digital</option>
                  <option value="Content">Content</option>
                </select>
                <input
                  name="searchQuery"
                  className="glass rounded-l-lg w-96 shadow-none border-none text-gray-300 text-sm focus:ring-blue-500 outline-none block p-2.5 dark:bg-gray-700 placeholder-gray-400"
                  autoComplete="none"
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder='Search with Name, Email, User ID and Type'
                />
              </div>
              <div className="d-flex justify-content-end align-items-center">
                <button className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg text-white d-flex align-items-center text-sm" onClick={() => setshowmodal(true)}>
                  <i className="fa-solid fa-plus" />
                  <p className="mx-2">Invite</p>
                </button>
                {invited && invited.length > 0 ?
                  <button className="ms-2 text-gray-50 p-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm" onClick={() => handleExportData()}>
                    <i className="fa-solid fa-download" /> <span className="mx-2"> Export as XLSX</span> </button>
                  : ""
                }
              </div>
            </div>

              <DataTable
                columns={invitedColumns}
                data={invited}
                responsive
                highlightOnHover
                fixedHeader
                theme="solarized"
                customStyles={customStyles}
                progressPending={load}
                progressComponent={
                  <Spinner className="m-5 no-left" loader={true} />
                }
                fixedHeaderScrollHeight="500px"
              />
            </>
          ) : (
            ""
          )
        }
      </div>
      {showModal && (
        <InviteIntroducerModal
          show={showModal}
          onClose={() => setshowmodal(false)}
        />
      )}
    </>
  );
};

export default Dashboard;
