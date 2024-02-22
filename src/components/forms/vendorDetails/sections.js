import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../../firebase.config';
import { showToast } from '../../../utils/toast';
import { Input } from '../../reusable/input'
import GSTTable from './gstTable';
import PartyDisclosure from './partyDisclosure';
import GeneralQuestionsTable from './generalQuestionsTable';

const SectionOne = ({ isEditable, user, vtype }) => {
    const [secOne, setSecOne] = useState([]);
    const [generalObj, setgeneralobj] = useState({});
    const [generalList, setgenerallist] = useState([]);
    const [accountsDetails, setaccountsdetails] = useState({});
    const [salesDetails, setsalesdetails] = useState({});
    const [makerDetails, setmakerdetails] = useState({});
    const [gstRows, setGSTData] = useState([
        {
            gstStateCode: "",
            gstNo: "",
            billingAddress: "",
            serviceName: "",
            contactDetails: "",
        },
    ]);
    const [generalRows, setGeneralRows] = useState([
        {
            companyName: "",
            refName: "",
            refNumber: "",
        },
    ]);

    useEffect(() => {
        if (user?.uid) {
            onSnapshot(doc(db, "users", user?.uid), (doc) => {
                const allData = doc.data()?.vendorDetails;
                setSecOne({
                    ...secOne,
                    ...allData?.sectionOne,
                    nameOfVendor: doc.data()?.name,
                    panno: doc.data()?.pancard,
                    aadharcard: doc.data()?.aadharcard,
                });
                setaccountsdetails(allData?.sectionOne?.accountsDetails ? allData?.sectionOne?.accountsDetails : []);
                setsalesdetails(allData?.sectionOne?.salesDetails ? allData?.sectionOne?.salesDetails : []);
                setmakerdetails(allData?.sectionOne?.makerDetails ? allData?.sectionOne?.makerDetails : []);
                setGSTData(allData?.sectionOne?.gstTable ? allData?.sectionOne?.gstTable : []);
                setGeneralRows(allData?.sectionOne?.generalQuestions ? allData?.sectionOne?.generalQuestions : [])
            });
        }
    }, [user]);

    // GST Table Functions
    const addGSTTableRows = () => {
        const rowsInput = {
            companyName: "",
            refName: "",
            refNumber: "",
        };
        setGSTData([...gstRows, rowsInput]);
    };


    const deleteGSTTableRows = (index) => {
        const rows = [...gstRows];
        rows.splice(index, 1);
        setGSTData(rows);
    };

    const handleGSTChange = (index, e) => {
        const { name, value } = e.target;
        var rowsInput = [...gstRows];
        rowsInput[index][name] = value;
        setGSTData(rowsInput);
    };

    useEffect(() => {
        setSecOne({
            ...secOne,
            gstTable: gstRows,
        });
    }, [gstRows]);

    // Top 5 clients table
    const addGeneralQuestionsRows = () => {
        const rowsInput = {
            gstStateCode: "",
            gstNo: "",
            billingAddress: "",
            serviceName: "",
            contactDetails: "",
        };
        setGeneralRows([...generalRows, rowsInput]);
    };


    const deleteGeneralQuestionsRows = (index) => {
        const rows = [...generalRows];
        rows.splice(index, 1);
        setGeneralRows(rows);
    };

    const handleGeneralTableChange = (index, e) => {
        const { name, value } = e.target;
        var rowsInput = [...generalRows];
        rowsInput[index][name] = value;
        setGeneralRows(rowsInput);
    };

    useEffect(() => {
        setSecOne({
            ...secOne,
            generalQuestions: generalRows,
        });
    }, [generalRows]);

    useEffect(() => {
        const keyPersonal = {
            accountsDetails,
            salesDetails,
            makerDetails,
        };
        setSecOne({
            ...secOne,
            ...keyPersonal,
        });
    }, [accountsDetails, salesDetails, makerDetails]);

    const handleSetState = (e, section) => {
        if (section === 1) {
            setSecOne({
                ...secOne,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSaveSection = async (e, section) => {
        e.preventDefault();
        if (section === 1) {
            await updateDoc(doc(db, "users", user.uid), {
                vendorTypes: vtype,
                "vendorDetails.sectionOne": secOne
            });
            showToast("success", "Section I Saved Successfully");
        }
    };

    const handleKeyPersonalData = (e) => {
        if (e.target.name.includes("accounts")) {
            setaccountsdetails({
                ...accountsDetails,
                [e.target.name]: e.target.value,
            });
        }
        if (e.target.name.includes("sales")) {
            setsalesdetails({
                ...salesDetails,
                [e.target.name]: e.target.value,
            });
        }
        if (e.target.name.includes("maker")) {
            setmakerdetails({
                ...makerDetails,
                [e.target.name]: e.target.value,
            });
        }
    };

    return (
        <form onSubmit={(e) => handleSaveSection(e, 1)}>
            <div className="accordion-item my-2 rounded-none glass shadow-none">
                <h2 className="accordion-header" id="secOne">
                    <button
                        className="accordion-button bg-transparent collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseSectionOne"
                        aria-expanded="true"
                        aria-controls="collapseSectionOne"
                    >
                        <h3 className="text-white text-start text-uppercase text-lg ">
                            Section 1 - Vendor Information Details
                        </h3>
                    </button>
                </h2>
                <div
                    id="collapseSectionOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="secOne"
                    data-bs-parent="#accordionExample"
                >
                    <div className="accordion-body text-white">
                        <div className="my-3">
                            <div className="row mt-2 ">
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="nameOfVendor"
                                        label="Name of the Vendor"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.nameOfVendor}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="businessAddress"
                                        label="Business Address"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.businessAddress}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="addressL1"
                                        label="Address (Line 1)"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.addressL1}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="addressL2"
                                        label="Address (Line 2)"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.addressL2}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="addressL3"
                                        label="Address (Line 3)"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.addressL3}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="city"
                                        label="City"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.city}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="pincode"
                                        label="Pin/Zip/Post Code"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.pincode}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="country"
                                        label="Country"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.country}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="telephone"
                                        label="Telephone number with area code:"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.telephone}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="billingAddress"
                                        label="Billing Address (if different from Business Address)"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.billingAddress}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="companyWebsite"
                                        label="Company Website if any"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.companyWebsite}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-300"
                                    >
                                        Vendor status:
                                    </label>
                                    <select
                                        defaultValue=""
                                        name="vendorStatus"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.vendorStatus}
                                        disabled={isEditable}
                                        className="bg-gray-500 shadow-none border-none text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        aria-label="Default select"
                                        required
                                    >
                                        <option selected value="" disabled>
                                            Select
                                        </option>
                                        <option value="Public Limited Company">
                                            Public Limited Company
                                        </option>
                                        <option value="Private Limited Company">
                                            Private Limited Company
                                        </option>
                                        <option value="Partnership Firm">
                                            Partnership Firm
                                        </option>
                                        <option value="Sole Proprietor Firm">
                                            Sole Proprietor Firm
                                        </option>
                                        <option value="Local Inter Company">
                                            Local Inter Company
                                        </option>
                                        <option value="Foreign Inter Company">
                                            Foreign Inter Company
                                        </option>
                                        <option value="Individual(Moderator/Freelancer)">
                                            Individual(Moderator/Freelancer)
                                        </option>
                                        <option value="Hindu Undivided Family">
                                            Hindu Undivided Family
                                        </option>
                                        <option value="Employee">Employee</option>
                                        <option value="Association of Persons">
                                            Association of Persons
                                        </option>
                                        <option value="Trust and Body of Individuals">
                                            Trust and Body of Individuals
                                        </option>
                                    </select>
                                </div>
                                <div className="col-4 mb-4">
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-300"
                                    >
                                        Date of Incorporation
                                    </label>
                                    <input
                                        type="date"
                                        name="dateOfIncorporation"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.dateOfIncorporation}
                                        disabled={isEditable}
                                        className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        autoComplete="none"
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="aadharcard"
                                        label="Registration number /Aadhar Card number"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.aadharcard}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="yearsInBusiness"
                                        label="No. of years in the Business"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.yearsInBusiness}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-300"
                                    >
                                        Details of reference (if any) who introduced
                                    </label>
                                    <select
                                        defaultValue=""
                                        name="reference"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value={secOne?.reference}
                                        disabled={isEditable}
                                        className="bg-gray-500 shadow-none border-none text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        aria-label="Default select"
                                        required
                                    >
                                        <option selected value="NA">
                                            NA
                                        </option>
                                        <option value="Client Reference">
                                            Client Reference
                                        </option>
                                        <option value="Worked with this vendor in past">
                                            Worked with this vendor in past
                                        </option>
                                        <option value="Referred  by Co-worker">
                                            Referred by Co-worker
                                        </option>
                                        <option value="OMD mandatory">OMD mandatory</option>
                                        <option value="Advisory">Advisory</option>
                                    </select>
                                </div>
                                <div className="col-4 mb-4">
                                  
                                    <div className="input-group mb-3 flex-nowrap">
                                        <select
                                            defaultValue=""
                                            name="que1"
                                            style={{ width: "80px" }}
                                            onChange={(e) => handleSetState(e, 1)}
                                            value={secOne?.que1}
                                            disabled={isEditable}
                                            className="bg-gray-500 shadow-none border-none text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            aria-label="Default select"
                                            required
                                        >
                                            <option>Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                        <input
                                            type="text"
                                            name="ans1"
                                            onChange={(e) => handleSetState(e, 1)}
                                            value={secOne?.ans1}
                                            disabled={isEditable || secOne?.que1 == "no"}
                                            className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            autoComplete="none"
                                        />
                                    </div>
                                </div>
                                <div className="col-4 mb-4">
                                 
                                    <div className="input-group mb-3 flex-nowrap">
                                        <select
                                            defaultValue=""
                                            name="que2"
                                            style={{ width: "80px" }}
                                            onChange={(e) => handleSetState(e, 1)}
                                            value={secOne?.que2}
                                            disabled={isEditable}
                                            className="bg-gray-500 shadow-none border-none text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            aria-label="Default select"
                                            required
                                        >
                                            <option>Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                        <input
                                            type="text"
                                            name="ans2"
                                            onChange={(e) => handleSetState(e, 1)}
                                            value={secOne?.ans2}
                                            disabled={isEditable || secOne?.que2 == "no"}
                                            className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            autoComplete="none"
                                        />
                                    </div>
                                </div>
                                <div className="col-4 mb-4">
                                    
                                    <div className="input-group mb-3 flex-nowrap">
                                        <select
                                            defaultValue=""
                                            name="que3"
                                            style={{ width: "80px" }}
                                            onChange={(e) => handleSetState(e, 1)}
                                            value={secOne?.que3}
                                            disabled={isEditable}
                                            className="bg-gray-500 shadow-none border-none text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            aria-label="Default select"
                                            required
                                        >
                                            <option>Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                        <input
                                            type="text"
                                            name="ans3"
                                            onChange={(e) => handleSetState(e, 1)}
                                            value={secOne?.ans3}
                                            disabled={isEditable || secOne?.que3 == "no"}
                                            className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            autoComplete="none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="my-3">
                                <h3 className="text-white text-start text-uppercase text-lg ">
                                    Details of Key Personnel
                                </h3>
                                <div className="mt-2">
                                    <table className="table table-borderless text-xs glass text-white">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th className="text-center">Name & Designation</th>
                                                <th className="text-center">
                                                    Phone No./Mobile No.
                                                </th>
                                                <th className="text-center">Email Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-left">
                                                    Contact Person in Accounts / Finance Dept.
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="accountsNameDesignation"
                                                        value={accountsDetails?.accountsNameDesignation}
                                                        disabled={isEditable}
                                                        onChange={(e) => handleKeyPersonalData(e)}
                                                        className=" text-white shadow-none glass focus:bg-transparent text-xs w-100"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="accountsPhoneNumber"
                                                        value={accountsDetails?.accountsPhoneNumber}
                                                        disabled={isEditable}
                                                        onChange={(e) => handleKeyPersonalData(e)}
                                                        className=" text-white shadow-none glass focus:bg-transparent text-xs w-100"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="accountsEmail"
                                                        value={accountsDetails?.accountsEmail}
                                                        disabled={isEditable}
                                                        onChange={(e) => handleKeyPersonalData(e)}
                                                        className=" text-white shadow-none glass focus:bg-transparent text-xs w-100"
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-left">
                                                    Contact Person in Sales / Service
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="salesNameDesignation"
                                                        value={salesDetails?.salesNameDesignation}
                                                        disabled={isEditable}
                                                        onChange={(e) => handleKeyPersonalData(e)}
                                                        className=" text-white shadow-none glass focus:bg-transparent text-xs w-100"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="salesPhoneNumber"
                                                        value={salesDetails?.salesPhoneNumber}
                                                        disabled={isEditable}
                                                        onChange={(e) => handleKeyPersonalData(e)}
                                                        className=" text-white shadow-none glass focus:bg-transparent text-xs w-100"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="salesEmail"
                                                        value={salesDetails?.salesEmail}
                                                        disabled={isEditable}
                                                        onChange={(e) => handleKeyPersonalData(e)}
                                                        className=" text-white shadow-none glass focus:bg-transparent text-xs w-100"
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-left">
                                                    Any Other Decision Maker (give Designation)
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="makerNameDesignation"
                                                        value={makerDetails?.makerNameDesignation}
                                                        disabled={isEditable}
                                                        onChange={(e) => handleKeyPersonalData(e)}
                                                        className=" text-white shadow-none glass focus:bg-transparent text-xs w-100"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="makerPhoneNumber"
                                                        value={makerDetails?.makerPhoneNumber}
                                                        disabled={isEditable}
                                                        onChange={(e) => handleKeyPersonalData(e)}
                                                        className=" text-white shadow-none glass focus:bg-transparent text-xs w-100"
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="makerEmail"
                                                        value={makerDetails?.makerEmail}
                                                        disabled={isEditable}
                                                        onChange={(e) => handleKeyPersonalData(e)}
                                                        className=" text-white shadow-none glass focus:bg-transparent text-xs w-100"
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="my-3">
                                <h3 className="text-white text-start text-uppercase text-lg mb-3">
                                    Statute Data
                                </h3>
                                <div className="mt-2 row">
                                    <div className="col-4 mb-4">
                                        <Input
                                            inputName="panno"
                                            label="PAN No. (provide a copy of the PAN Card)"
                                            onChange={(e) => handleSetState(e, 1)}
                                            value={secOne?.panno}
                                            disabled={isEditable}
                                            required
                                        />
                                    </div>
                                    <div className="col-4 mb-4">
                                        <Input
                                            inputName="taxResidencyNo"
                                            label="Tax Residency Certificate No. (applicable for Overseas
                            vendors only) - Attach TRC copy (Higher WHT is
                            applicable in absence of TRC)"
                                            onChange={(e) => handleSetState(e, 1)}
                                            value={secOne?.taxResidencyNo}
                                            disabled={isEditable}
                                            required
                                        />
                                    </div>
                                    <div className="col-4 mb-4">
                                        <Input
                                            inputName="withHoldingTaxes"
                                            label="Withholding taxes will be deducted as per the
                        prevailling applicable rates basis the tax
                        declarations/certificates provided to us"
                                            // onChange={(e) => handleSetState(e, 1)}
                                            value="Yes"
                                            disabled={isEditable}
                                            required
                                        />
                                    </div>
                                    <div className="col-4 mb-4">
                                        <label
                                            htmlFor="name"
                                            className="block mb-2 text-sm font-medium text-gray-300"
                                        >
                                            GST Classification
                                        </label>
                                        <select
                                            defaultValue=""
                                            name="gstClassification"
                                            onChange={(e) => handleSetState(e, 1)}
                                            value={secOne?.gstClassification}
                                            disabled={isEditable}
                                            className="bg-gray-500 shadow-none border-none text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            aria-label="Default select"
                                            required
                                        >
                                            <option selected value="" disabled>
                                                Select
                                            </option>
                                            <option value="GST Registration vendor">
                                                GST Registered vendor
                                            </option>
                                            <option value="Unregistration vendor">
                                                Unregistered vendor
                                            </option>
                                            <option value="Foreign Vendor">Foreign Vendor</option>
                                            <option value="Composition Vendor">
                                                Composition Vendor
                                            </option>
                                            <option value="Related Vendor">Related Vendor</option>
                                            <option value="Branch Vendor">Branch Vendor</option>
                                            <option value="Exempt">Exempt</option>
                                        </select>
                                    </div>
                                    <div className="col-4 mb-4">
                                        <Input
                                            inputName="eInvoicing"
                                            label="E-Invoicing Applicable?"
                                            onChange={(e) => handleSetState(e, 1)}
                                            value={secOne?.eInvoicing}
                                            disabled={isEditable}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <table className="table align-middle text-xs text-white glass border-0">
                                        <thead>
                                            <tr>
                                                <th className="px-3 font-thin">GST State Code</th>
                                                <th className="px-3 font-thin">GST No.</th>
                                                <th className="px-3 font-thin">
                                                    Goods Name / Service Name
                                                </th>
                                                <th className="px-3 font-thin">
                                                    Tax Personnel Contact
                                                </th>
                                                <th className="px-3 font-thin">
                                                    Billing address as per GSTN
                                                </th>
                                                <th className="px-3 font-thin">
                                                    <button
                                                        type='button'
                                                        className="btn btn-success bg-success"
                                                        onClick={addGSTTableRows}
                                                        disabled={isEditable}
                                                    >
                                                        +
                                                    </button>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <GSTTable
                                                gstRows={gstRows}
                                                deleteGSTTableRows={deleteGSTTableRows}
                                                handleGSTChange={handleGSTChange}
                                                disabled={isEditable}
                                            />
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-2 glass">
                                    <div className="row">
                                        <div className="col-4 d-flex align-items-center">
                                            <p className="text-justify text-xs p-4">
                                                I / we declare as follows in relation to Micro,
                                                Small and Medium Enterprises Development Act, 2006
                                                (hereinafter referred as “the Act”)
                                            </p>
                                        </div>
                                        <div className="col-8">
                                            <table className="table align-middle text-xs text-white border-0">
                                                <thead>
                                                    <tr>
                                                        <th className="px-4 font-thin">
                                                            MSME Investment in Plant & Machinery &
                                                            turnover
                                                        </th>
                                                        <th className="px-4 font-thin">
                                                            Type of Enterprise
                                                        </th>
                                                        <th className="px-4 font-thin">
                                                            Please select as applicable
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td></td>
                                                        <td className="px-4">
                                                            We are not covered under the Act
                                                        </td>
                                                        <td className="px-4">
                                                            <select
                                                                onChange={(e) => handleSetState(e, 1)}
                                                                defaultValue={"no"}
                                                                value={secOne?.noType}
                                                                disabled={isEditable}
                                                                name="noType"
                                                                className="bg-gray-500 shadow-none border-none text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                aria-label="Default select"
                                                                required
                                                            >
                                                                <option value="yes">Yes</option>
                                                                <option value="no">No</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4">
                                                            Micro- &lt; Rs.1 crore & &lt; Rs.5 crore
                                                        </td>
                                                        <td className="px-4">
                                                            I / We are covered under the Act as Micro
                                                            Enterprise
                                                        </td>
                                                        <td className="px-4">
                                                            <select
                                                                defaultValue="notapplicable"
                                                                onChange={(e) => handleSetState(e, 1)}
                                                                value={secOne?.microType}
                                                                disabled={
                                                                    secOne?.noType == "yes" ||
                                                                    secOne?.smallType == "applicable" ||
                                                                    secOne?.mediumType == "applicable"
                                                                }
                                                                name="microType"
                                                                className="bg-gray-500 shadow-none border-none text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                aria-label="Default select"
                                                            >
                                                                <option value="applicable">
                                                                    Applicable
                                                                </option>
                                                                <option value="notapplicable">
                                                                    Not Applicable
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4">
                                                            Small- &lt; Rs.10 crore & &lt; Rs.50 crore
                                                        </td>
                                                        <td className="px-4">
                                                            I / We are covered under the Act as Small
                                                            Enterprise
                                                        </td>
                                                        <td className="px-4">
                                                            <select
                                                                defaultValue="notapplicable"
                                                                onChange={(e) => handleSetState(e, 1)}
                                                                value={secOne?.smallType}
                                                                disabled={
                                                                    secOne?.noType == "yes" ||
                                                                    secOne?.microType == "applicable" ||
                                                                    secOne?.mediumType == "applicable"
                                                                }
                                                                name="smallType"
                                                                className="bg-gray-500 shadow-none border-none text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                aria-label="Default select"
                                                            >
                                                                <option value="applicable">
                                                                    Applicable
                                                                </option>
                                                                <option value="notapplicable">
                                                                    Not Applicable
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4">
                                                            Medium- &lt; Rs.50 crore & &lt; Rs.250 crore
                                                        </td>
                                                        <td className="px-4">
                                                            I / We are covered under the Act as Medium
                                                            Enterprise
                                                        </td>
                                                        <td className="px-4">
                                                            <select
                                                                defaultValue="notapplicable"
                                                                onChange={(e) => handleSetState(e, 1)}
                                                                value={secOne?.mediumType}
                                                                disabled={
                                                                    secOne?.noType == "yes" ||
                                                                    secOne?.smallType == "applicable" ||
                                                                    secOne?.microType == "applicable"
                                                                }
                                                                name="mediumType"
                                                                className="bg-gray-500 shadow-none border-none text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-700 disabled:opacity-100 disabled:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                aria-label="Default select"
                                                            >
                                                                <option value="applicable">
                                                                    Applicable
                                                                </option>
                                                                <option value="notapplicable">
                                                                    Not Applicable
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="my-3">
                                <h3 className="text-white text-start text-uppercase text-lg">
                                    General Questions
                                </h3>
                                <div className="mt-2">
                                    <p><small>Who are your top 5 Corporate Clients (in descending order of business). Provide a reference contact details for each client.</small></p>
                                    <table className="table align-middle text-xs text-white glass border-0">
                                        <thead>
                                            <tr>
                                                <th className="px-3 font-thin">Company Name</th>
                                                <th className="px-3 font-thin">Reference (Contact Name)</th>
                                                <th className="px-3 font-thin">
                                                    Reference (Contact No./Email)
                                                </th>
                                                <th className="px-3 font-thin">
                                                    <button
                                                        type='button'
                                                        className="btn btn-success bg-success"
                                                        onClick={addGeneralQuestionsRows}
                                                        disabled={isEditable}
                                                    >
                                                        +
                                                    </button>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <GeneralQuestionsTable
                                                generalObj={generalRows}
                                                deleteGeneralQuestionsRows={deleteGeneralQuestionsRows}
                                                handleGeneralTableChange={handleGeneralTableChange}
                                                disabled={isEditable}
                                            />
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-2 row">
                                    <div className="col-4 mb-4">
                                        <Input
                                            inputName="operatingLocations"
                                            label="Operating Locations - Countries / cities"
                                            onChange={(e) => handleSetState(e, 1)}
                                            value={secOne?.operatingLocations}
                                            disabled={isEditable}
                                            required
                                        />
                                    </div>
                                    <div className="col-4 mb-4">
                                        <Input
                                            inputName="qualityControlOperation"
                                            label="Provide a brief on the Quality control steps taken in
                        your operations in relation to your services to
                        (Entity's Name to be added here)"
                                            onChange={(e) => handleSetState(e, 1)}
                                            value={secOne?.qualityControlOperation}
                                            disabled={isEditable}
                                            required
                                        />
                                    </div>
                                    <div className="col-4 mb-4">
                                        <Input
                                            inputName="qualityControlVendor"
                                            label="Provide a brief on the Quality control steps taken by
                        your vendor in relation to the services to (Entity's
                        Name to be added here)"
                                            onChange={(e) => handleSetState(e, 1)}
                                            value={secOne?.qualityControlVendor}
                                            disabled={isEditable}
                                            required
                                        />
                                    </div>
                                    <div className="col-4 mb-4">
                                        <label
                                            htmlFor="name"
                                            className="block mb-2 text-sm font-medium text-gray-300"
                                        >
                                            How long do you retain the information submitted by
                                            the Company{" "}
                                        </label>
                                        <input
                                            type="text"
                                            onChange={(e) => handleSetState(e, 1)}
                                            value={secOne?.retainInformation}
                                            disabled={isEditable}
                                            name="retainInformation"
                                            className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            autoComplete="none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {!isEditable && (
                            <div className="my-3 d-flex w-48 ml-auto">
                                <button
                                    className="btn btn-primary rounded-lg w-100"
                                    // onClick={}
                                    type='submit'
                                >
                                    Save
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    )
}

const SectionFive = ({ isEditable, user }) => {
    const [secFive, setSecFive] = useState([]);
    const [partyRows, setPartyRows] = useState([
        {
            vendorPartyName: "",
            vendorRole: "",
            vendorInterestedPartyName: "",
            detailsOfInterest: "",
        },
    ]);

    useEffect(() => {
        if (user) {
            onSnapshot(doc(db, "users", user.uid), (doc) => {
                const allData = doc.data()?.vendorDetails;
                setSecFive(allData?.sectionFive);
                setPartyRows(allData?.sectionFive?.partyTable ? allData?.sectionFive?.partyTable : []);
            });
        }
    }, [user]);

    const handleSetState = (e, section) => {
        if (section === 5) {
            setSecFive({
                ...secFive,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSaveSection = async (e, section) => {
        e.preventDefault();
        if (section === 5) {
            await updateDoc(doc(db, "users", user.uid), {
                "vendorDetails.sectionFive": secFive
            });
            showToast("success", "Section V Saved Successfully");
        }
    };

    // Party Disclosure Functions

    const addPartyTableRows = () => {
        const rowsInput = {
            vendorPartyName: "",
            vendorRole: "",
            vendorInterestedPartyName: "",
            detailsOfInterest: "",
        };
        setPartyRows([...partyRows, rowsInput]);
    };

    const deletePartyTableRows = (index) => {
        const rows = [...partyRows];
        rows.splice(index, 1);
        setPartyRows(rows);
    };

    const handlePartyChange = (index, evnt) => {
        const { name, value } = evnt.target;
        const rowsInput = [...partyRows];
        rowsInput[index][name] = value;
        setPartyRows(rowsInput);
    };

    useEffect(() => {
        setSecFive({
            ...secFive,
            partyTable: partyRows,
        });
    }, [partyRows]);

    return (
        <form onSubmit={(e) => handleSaveSection(e, 5)}>
            <div className="accordion-item my-2 rounded-none glass shadow-none">
                <h2 className="accordion-header" id="secFive">
                    <button
                        className="accordion-button bg-transparent collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseSectionFive"
                        aria-expanded="true"
                        aria-controls="collapseSectionFive"
                    >
                        <h3 className="text-white text-start text-uppercase text-lg ">
                            Section 5 - Vendor Related Party Disclosure
                        </h3>
                    </button>
                </h2>
                <div
                    id="collapseSectionFive"
                    className="accordion-collapse collapse"
                    aria-labelledby="secFive"
                    data-bs-parent="#accordionExample"
                >
                    <div className="accordion-body text-white">
                        <p className="h4 font-bold">Disclosure of Interest</p>
                        <p className="font-light text-justify mb-2">
                            <em>Definition of related party relationship</em>{" "}
                        </p>
                        
                        <div className="my-3">
                            <p className="font-light text-justify">
                                Related party scenario
                            </p>
                            <div className="row mt-2 ">
                                <div className="col-12 mb-4">
                                    

                                    <input
                                        type="radio"
                                        name="scenario1"
                                        value="yes"
                                        checked={secFive?.scenario1 == "yes"}
                                        disabled={isEditable}
                                        onChange={(e) => handleSetState(e, 5)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        style={{ marginLeft: "5px", marginRight: "10px" }}
                                        className="ml-5 text-sm font-medium text-gray-300"
                                    >
                                        Yes
                                    </label>
                                    <input
                                        type="radio"
                                        name="scenario1"
                                        value="no"
                                        checked={secFive?.scenario1 == "no"}
                                        disabled={isEditable}
                                        onChange={(e) => handleSetState(e, 5)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        style={{ marginLeft: "5px", marginRight: "10px" }}
                                        className="ml-5 text-sm font-medium text-gray-300"
                                    >
                                        No
                                    </label>
                                </div>
                                <div className="col-12 mb-4">
                                    

                                    <input
                                        type="radio"
                                        name="scenario2"
                                        value="yes"
                                        checked={secFive?.scenario2 == "yes"}
                                        disabled={isEditable}
                                        onChange={(e) => handleSetState(e, 5)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        style={{ marginLeft: "5px", marginRight: "10px" }}
                                        className="ml-5 text-sm font-medium text-gray-300"
                                    >
                                        Yes
                                    </label>
                                    <input
                                        type="radio"
                                        name="scenario2"
                                        value="no"
                                        checked={secFive?.scenario2 == "no"}
                                        disabled={isEditable}
                                        onChange={(e) => handleSetState(e, 5)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        style={{ marginLeft: "5px", marginRight: "10px" }}
                                        className="ml-5 text-sm font-medium text-gray-300"
                                    >
                                        No
                                    </label>
                                </div>
                                <div className="col-12 mb-4">
                                    

                                    <input
                                        type="radio"
                                        name="scenario3"
                                        value="yes"
                                        checked={secFive?.scenario3 == "yes"}
                                        disabled={isEditable}
                                        onChange={(e) => handleSetState(e, 5)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        style={{ marginLeft: "5px", marginRight: "10px" }}
                                        className="ml-5 text-sm font-medium text-gray-300"
                                    >
                                        Yes
                                    </label>
                                    <input
                                        type="radio"
                                        name="scenario3"
                                        value="no"
                                        checked={secFive?.scenario3 == "no"}
                                        disabled={isEditable}
                                        onChange={(e) => handleSetState(e, 5)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        style={{ marginLeft: "5px", marginRight: "10px" }}
                                        className="ml-5 text-sm font-medium text-gray-300"
                                    >
                                        No
                                    </label>
                                </div>
                                <div className="col-12 mb-4">
                                   
                                    <input
                                        type="radio"
                                        name="scenario4"
                                        value="yes"
                                        checked={secFive?.scenario4 == "yes"}
                                        disabled={isEditable}
                                        onChange={(e) => handleSetState(e, 5)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        style={{ marginLeft: "5px", marginRight: "10px" }}
                                        className="ml-5 text-sm font-medium text-gray-300"
                                    >
                                        Yes
                                    </label>
                                    <input
                                        type="radio"
                                        name="scenario4"
                                        value="no"
                                        checked={secFive?.scenario4 == "no"}
                                        disabled={isEditable}
                                        onChange={(e) => handleSetState(e, 5)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        style={{ marginLeft: "5px", marginRight: "10px" }}
                                        className="ml-5 text-sm font-medium text-gray-300"
                                    >
                                        No
                                    </label>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table align-middle text-xs text-white glass shadow-none border-0">
                                    <thead>
                                        <tr>
                                            <th className="px-3 font-thin">Sr. No.</th>
                                            <th className="px-3 font-thin">
                                                Full Name of Vendor Party
                                            </th>
                                            <th className="px-3 font-thin">
                                                Role at/relationship with Vendor
                                            </th>
                                            
                                            <th className="px-3 font-thin">
                                                Nature/details of interest
                                            </th>
                                            <th className="px-3 font-thin">
                                                <button
                                                    type='button'
                                                    className="btn btn-success bg-success"
                                                    onClick={addPartyTableRows}
                                                    disabled={isEditable}
                                                >
                                                    +
                                                </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <PartyDisclosure
                                            partyRows={partyRows}
                                            deletePartyTableRows={deletePartyTableRows}
                                            handlePartyChange={handlePartyChange}
                                            disabled={isEditable}
                                        />
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-3 border-t border-b mt-3">
                                <p className="h4 font-bold">Definitions</p>
                                <p className="h6 font-medium">
                                    “<strong>Vendor Party</strong>” means:
                                </p>
                                <ul className="mb-3 text-sm">
                                    <li>(a) the Vendor ; or</li>
                                    <li>
                                        (b) any director, employee, agent or sub-contractor of
                                        the Vendor ; or
                                    </li>
                                    <li>
                                        (c) any close family member of a director, employee,
                                        agent or sub-contractor of the Vendor .
                                    </li>
                               </ul>
                            </div>
                        </div>
                        {!isEditable && (
                            <div className="my-3 d-flex w-48 ml-auto">
                                <button
                                    className="btn btn-primary rounded-lg w-100"
                                    type='submit'
                                >
                                    Save
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    )
}

const SectionSix = ({ isEditable, user }) => {
    const [data, setdata] = useState();
    const [secSix, setSecSix] = useState([]);

    useEffect(() => {
        if (user) {
            onSnapshot(doc(db, "users", user.uid), (doc) => {
                const allData = doc.data()?.vendorDetails;
                setdata(doc.data());
                setSecSix(allData?.sectionSix);
            });
        }
    }, [user]);

    const handleSetState = (e, section) => {
        if (section === 6) {
            setSecSix({
                ...secSix,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSaveSection = async (e, section) => {
        e.preventDefault();
        if (section === 6) {
            await updateDoc(doc(db, "users", user.uid), {
                "vendorDetails.sectionSix": secSix
            });
            showToast("success", "Section VI Saved Successfully");
        }
    };
    return (
        <form onSubmit={(e) => handleSaveSection(e, 6)}>
            <div className="accordion-item my-2 rounded-none glass shadow-none">
                <h2 className="accordion-header" id="secSix">
                    <button
                        className="accordion-button bg-transparent collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseSectionSix"
                        aria-expanded="true"
                        aria-controls="collapseSectionSix"
                    >
                        <h3 className="text-white text-start text-uppercase text-lg ">
                            Section 6 - No RO No Work Policy
                        </h3>
                    </button>
                </h2>
                <div
                    id="collapseSectionSix"
                    className="accordion-collapse collapse"
                    aria-labelledby="secSix"
                    data-bs-parent="#accordionExample"
                >
                    <div className="accordion-body text-white">
                        <div className="">
                            <div id="disableDiv" className="p-3 border-t">
                                <ol className="mb-3 text-sm">
                                    <li className="mb-1">
                                        <p className="text-lg">
                                            <strong>1. Work Preparation Stage</strong>
                                        </p>
                                        <ul className="ps-2">
                                            <li className="mb-1">
                                                a) Only Agency representatives are authorized to
                                                commit to the Vendor on any production or performing
                                                any type of services. So, before Vendor starts any
                                                work, the Vendor MUST have a duly signed Release
                                                Order ('RO').
                                            </li>
                                            <li className="mb-1">
                                                b) If the business was awarded to Vendor without
                                                Purchasing involvement (no RO), Agency will not be
                                                liable for any work carried out as there is no
                                                signed official Purchase order.
                                            </li>
                                            <li className="mb-1">
                                                c) We seek Vendor cooperation to follow this for
                                                vendor's benefit. Failure to follow the guidelines
                                                in any circumstances, agency will reserve the rights
                                                to:
                                                <ul className="ps-2">
                                                    <li className="mb-1">
                                                        • Not be responsible for any cost incurred;
                                                    </li>
                                                    <li className="mb-1">
                                                        • Reject the job already done and refuse to
                                                        issue RO for the job done.
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="mb-1">
                                        <p className="text-lg">
                                            <strong>2. Payment</strong>
                                        </p>
                                        <ul className="ps-2">
                                            <li className="mb-1">
                                                a) Quote our Release Order number on your invoice
                                            </li>
                                            <li className="mb-1">
                                                b) Invoices should be sent within 15 days after work
                                                completion, failing which Agency has the right to
                                                reject invoices and no payment shall be made due to
                                                that.
                                            </li>
                                        </ul>
                                    </li>
                                </ol>
                            </div>
                            <h3 className="text-white text-start text-uppercase text-lg border-b">
                                DECLARATION BY THE AUTHORISED REPRESENTATIVE OF THE VENDOR :
                            </h3>
                            <ol className="text-white text-sm list-decimal ps-4 mt-2 pb-2 border-b">
                                <li className="p-1">
                                    <p className="font-light text-justify">
                                        I /We have gone through all the Terms & Conditions
                                        applicable for registration and empanelment and the same
                                        are acceptable to me / us
                                    </p>
                                </li>
                                <li className="p-1">
                                    <p className="font-light text-justify">
                                        the goods / services being provided are a part of the
                                        core activity of our organisation.
                                    </p>
                                </li>
                                <li className="p-1">
                                    <p className="font-light text-justify">
                                        the payments to be made to me/us in the context of this
                                        business relationship will be exclusively used for the
                                        legitimate business objective as documented in the
                                        proposal / quote / agreement.
                                    </p>
                                </li>
                                <li className="p-1">
                                    <p className="font-light text-justify">
                                        there are no legal proceedings currently pending against
                                        us
                                    </p>
                                </li>
                                <li className="p-1">
                                    <p className="font-light text-justify">
                                        {" "}
                                        I / my company / management of the company am/is
                                        currently not accused of or have/has not been prosecuted
                                        in the past 5 years for any financial crimes (e.g. money
                                        laundering, violations of competition and antitrust law,
                                        corruption, bribery etc.).
                                    </p>
                                </li>
                                <li className="p-1">
                                    <p className="font-light text-justify">
                                        I / we will allow at its sole option to verify our
                                        statements with a background check, if necessary either
                                        by itself / third party.
                                    </p>
                                </li>
              
                            </ol>
                            <div className="row mt-4">
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="serviceProvider"
                                        label="Name of Service Provider"
                                        onChange={(e) => handleSetState(e, 6)}
                                        value={secSix?.serviceProvider}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="signatoryName"
                                        label="Name of Signatory"
                                        onChange={(e) => handleSetState(e, 6)}
                                        value={secSix?.signatoryName}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="positionOfSignatory"
                                        label="Position of Signatory"
                                        onChange={(e) => handleSetState(e, 6)}
                                        value={data?.designation}
                                        disabled={isEditable}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="signatoryContactNumber"
                                        label="Contact Number"
                                        onChange={(e) => handleSetState(e, 6)}
                                        disabled={isEditable}
                                        value={data?.phone}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="signatoryEmail"
                                        label="Email ID"
                                        onChange={(e) => handleSetState(e, 6)}
                                        disabled={isEditable}
                                        value={data?.email}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="place"
                                        label="Place"
                                        onChange={(e) => handleSetState(e, 6)}
                                        disabled={isEditable}
                                        value={secSix?.place}
                                        required
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <label
                                        htmlFor="date"
                                        className="block mb-2 text-sm font-medium text-gray-300"
                                    >
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="signatoryDate"
                                        value={secSix?.signatoryDate}
                                        disabled={isEditable}
                                        onChange={(e) => handleSetState(e, 6)}
                                        className="glass shadow-none border-none text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white disabled:opacity-100 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        autoComplete="none"
                                        required
                                    />
                                </div>
                            </div>
                            {!isEditable && (
                                <div className="my-3 d-flex w-48 ml-auto">
                                    <button
                                        className="btn btn-primary rounded-lg w-100"
                                        type='submit'
                                    >
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export {
    SectionOne, SectionFive, SectionSix
}