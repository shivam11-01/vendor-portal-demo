import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../../firebase.config';
import { showToast } from '../../../utils/toast';
import { Input } from '../../reusable/input'
import GSTTable from './gstTable';
import PartyDisclosure from './partyDisclosure';

const SectionOne = ({ isEditable, user, vtype }) => {
    const [secOne, setSecOne] = useState([]);
    const [generalObj, setgeneralobj] = useState({});
    const [generalList, setgenerallist] = useState([]);
    const [accountsDetails, setaccountsdetails] = useState({});
    const [salesDetails, setsalesdetails] = useState({});
    const [makerDetails, setmakerdetails] = useState({});
    const [data, setdata] = useState({
        name: "",
        pancard: "",
        aadharcard: "",
    });
    const [gstRows, setGSTData] = useState([
        {
            gstStateCode: "",
            gstNo: "",
            billingAddress: "",
            serviceName: "",
            contactDetails: "",
        },
    ]);

    useEffect(() => {
        if (user?.uid) {
            onSnapshot(doc(db, "users", user?.uid), (doc) => {
                const allData = doc.data()?.vendorDetails;
                setdata({
                    name: doc.data()?.name,
                    pancard: doc.data()?.pancard,
                    aadharcard: doc.data()?.aadharcard,
                });
                setSecOne(allData?.sectionOne);
                setaccountsdetails(allData?.sectionOne?.accountsDetails ? allData?.sectionOne?.accountsDetails : []);
                setsalesdetails(allData?.sectionOne?.salesDetails ? allData?.sectionOne?.salesDetails : []);
                setmakerdetails(allData?.sectionOne?.makerDetails ? allData?.sectionOne?.makerDetails : []);
                setGSTData(allData?.sectionOne?.gstTable ? allData?.sectionOne?.gstTable : []);
            });
        }
    }, [user]);

    // GST Table Functions
    const addGSTTableRows = () => {
        const rowsInput = {
            gstStateCode: "",
            gstNo: "",
            billingAddress: "",
            serviceName: "",
            contactDetails: "",
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

    const handleSaveSection = async (section) => {
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

    const handleGeneralQuestions = (e) => {
        setgeneralobj({
            ...generalObj,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (
            generalObj?.companyName != undefined &&
            generalObj?.refName != undefined &&
            generalObj?.refNumber != undefined &&
            typeof generalObj?.refNumber == "string" ||
            typeof generalObj?.refNumber == "number"
        ) {
            setgenerallist([...generalList, generalObj]);
            setgeneralobj({});
        }
    }, [generalObj]);

    useEffect(() => {
        if (generalList.length > 0) {
            setSecOne({
                ...secOne,
                generalQuestions: generalList,
            });
        }
    }, [generalList]);

    return (
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
                                    value={data?.name}
                                    disabled={data?.name}
                                />
                            </div>
                            <div className="col-4 mb-4">
                                <Input
                                    inputName="addressL1"
                                    label="Address (Line 1)"
                                    onChange={(e) => handleSetState(e, 1)}
                                    value={secOne?.addressL1}
                                    disabled={isEditable}
                                />
                            </div>
                            <div className="col-4 mb-4">
                                <Input
                                    inputName="addressL2"
                                    label="Address (Line 2)"
                                    onChange={(e) => handleSetState(e, 1)}
                                    value={secOne?.addressL2}
                                    disabled={isEditable}
                                />
                            </div>
                            <div className="col-4 mb-4">
                                <Input
                                    inputName="addressL3"
                                    label="Address (Line 3)"
                                    onChange={(e) => handleSetState(e, 1)}
                                    value={secOne?.addressL3}
                                    disabled={isEditable}
                                />
                            </div>
                            <div className="col-4 mb-4">
                                <Input
                                    inputName="city"
                                    label="City"
                                    onChange={(e) => handleSetState(e, 1)}
                                    value={secOne?.city}
                                    disabled={isEditable}
                                />
                            </div>
                            <div className="col-4 mb-4">
                                <Input
                                    inputName="pincode"
                                    label="Pin/Zip/Post Code"
                                    onChange={(e) => handleSetState(e, 1)}
                                    value={secOne?.pincode}
                                    disabled={isEditable}
                                />
                            </div>
                            <div className="col-4 mb-4">
                                <Input
                                    inputName="country"
                                    label="Country"
                                    onChange={(e) => handleSetState(e, 1)}
                                    value={secOne?.country}
                                    disabled={isEditable}
                                />
                            </div>
                            <div className="col-4 mb-4">
                                <Input
                                    inputName="telephone"
                                    label="Telephone number with area code:"
                                    onChange={(e) => handleSetState(e, 1)}
                                    value={secOne?.telephone}
                                    disabled={isEditable}
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
                                <Input
                                    inputName="registrationNumber"
                                    label="Aadhar Card number"
                                    onChange={(e) => handleSetState(e, 1)}
                                    value={data?.aadharcard}
                                    disabled={data?.aadharcard}
                                />
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
                                        value={data?.pancard}
                                        disabled={data?.pancardisEditable}
                                    />
                                </div>
                                <div className="col-4 mb-4">
                                    <Input
                                        inputName="withHoldingTaxes"
                                        label="Withholding  taxes will be deducted as per the prevailling applicable rates basis the tax declarations/certificates provided to us"
                                        onChange={(e) => handleSetState(e, 1)}
                                        value="Yes"
                                        disabled={isEditable}
                                    />
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    {!isEditable && (
                        <div className="my-3 d-flex w-48 ml-auto">
                            <button
                                className="btn btn-primary rounded-lg w-100"
                                onClick={() => handleSaveSection(1)}
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
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

    const handleSaveSection = async (section) => {
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
                                                className="btn btn-success"
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
                                onClick={() => handleSaveSection(5)}
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const SectionSix = ({ isEditable, user, isMT }) => {
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

    const handleSaveSection = async (section) => {
        if (section === 6) {
            await updateDoc(doc(db, "users", user.uid), {
                "vendorDetails.sectionSix": secSix
            });
            showToast("success", "Section VI Saved Successfully");
        }
    };
    return (
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
                        {!isMT ? "Section 6 - No RO No Work Policy" : "Section 4 - Declaration"}
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
                        <div className="row mt-4">
                            <div className="col-4 mb-4">
                                <Input
                                    inputName="serviceProvider"
                                    label="Name of Service Provider"
                                    onChange={(e) => handleSetState(e, 6)}
                                    value={secSix?.serviceProvider}
                                    disabled={isEditable}
                                />
                            </div>
                            <div className="col-4 mb-4">
                                <Input
                                    inputName="signatoryName"
                                    label="Name of Signatory"
                                    onChange={(e) => handleSetState(e, 6)}
                                    value={data?.name}
                                    disabled={data?.name}
                                />
                            </div>
                            <div className="col-4 mb-4">
                                <Input
                                    inputName="positionOfSignatory"
                                    label="Position of Signatory"
                                    onChange={(e) => handleSetState(e, 6)}
                                    value={data?.designation}
                                    disabled={data?.designation}
                                />
                            </div>
                            <div className="col-4 mb-4">
                                <Input
                                    inputName="signatoryContactNumber"
                                    label="Contact Number"
                                    onChange={(e) => handleSetState(e, 6)}
                                    disabled={data?.phone}
                                    value={data?.phone}
                                />
                            </div>
                            <div className="col-4 mb-4">
                                <Input
                                    inputName="signatoryEmail"
                                    label="Email ID"
                                    onChange={(e) => handleSetState(e, 6)}
                                    disabled={data?.email}
                                    value={data?.email}
                                />
                            </div>
                            <div className="col-4 mb-4">
                                <Input
                                    inputName="place"
                                    label="Place"
                                    onChange={(e) => handleSetState(e, 6)}
                                    disabled={isEditable}
                                    value={secSix?.place}
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
                                />
                            </div>
                        </div>
                        {!isEditable && (
                            <div className="my-3 d-flex w-48 ml-auto">
                                <button
                                    className="btn btn-primary rounded-lg w-100"
                                    onClick={() => handleSaveSection(6)}
                                >
                                    Save
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export {
    SectionOne, SectionFive, SectionSix
}