import { onAuthStateChanged } from "firebase/auth";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../../../firebase.config";
import GSTTable from "./gstTable";
import PartyDisclosure from "./partyDisclosure";
import { showToast } from "../../../utils/toast";
import { useNavigate } from "react-router-dom";
import { Input } from "../../reusable/input";
import Termsandcondition from "../../reusable/modal/termsandcondition";
import ReactToPrint from "react-to-print";
import { SectionFive, SectionFour, SectionOne, SectionSix, SectionThree, SectionTwo } from "./sections";


const VendorDetails = () => {
  const initialstate = [
    { name: "TV", isChecked: false },
    { name: "Print", isChecked: false },
    { name: "Radio", isChecked: false },
    { name: "Digital", isChecked: false },
    { name: "OOH", isChecked: false },
    { name: "Content", isChecked: false },
    { name: "Influencer", isChecked: false },
    { name: "Sponserships and Events", isChecked: false },
    { name: "Activation", isChecked: false },
    { name: "Sports Partnership", isChecked: false },
    { name: "Talent Management", isChecked: false },
    { name: "Overheads", isChecked: false },
  ];
  const [user, setuser] = useState();
  const [data, setdata] = useState();
  const [radioArray, setradioarray] = useState(initialstate);
  const [showModal, setshowModal] = useState(false);
  const [recall, setrecall] = useState(false);
  const [isEditable, setisEditable] = useState(false);

  const navigate = useNavigate();

  const handleCheckbox = async (e, index) => {
    console.log(e.target.checked, index);
    var tmpradio = [...radioArray];
    console.log(tmpradio[index]);
    tmpradio[index].isChecked = e.target.checked;
    setradioarray(tmpradio);
    console.log(tmpradio);
    await updateDoc(doc(db, "usrs", user.uid), {
      "vendorTypes": tmpradio,
    });
  }

  const scroll = (search) => {
    if (search.includes("One")) {
      window.scrollBy(0, 550);
    }
    if (search.includes("Two")) {
      window.scrollBy(0, 622);
    }
    if (search.includes("Three")) {
      window.scrollBy(0, 700);
    }
    if (search.includes("Four")) {
      window.scrollBy(0, 760);
    }
    if (search.includes("Five")) {
      window.scrollBy(0, 830);
    }
    if (search.includes("Six")) {
      window.scrollBy(0, 900);
    }
  };

  useEffect(() => {
    if (window.location.hash) {
      const path = window.location.hash.replace("#", "");
      let accord = document.getElementById(path);
      const isCollapse = accord.classList.contains("collapse");
      if (isCollapse) {
        accord.classList.remove("collapse");
        accord.classList.add("collapsed");
        scroll(path);
      }
    }
  }, [window.location.hash])

  useEffect(() => {
    if (recall) {
      handleSubmit()
    }
  }, [recall === true]);

  // handle submit
  const handleSubmit = async () => {
    if (auth.currentUser && auth.currentUser.uid) {
      await updateDoc(doc(db, "users", user.uid), {
        "forms.vendorform": 1
      });
      const currentDate = Date.now();
      const log = {
        title: `${user.displayName} submitted Vendor Form`,
        timestamp: currentDate,
      }
      await updateDoc(doc(db, "users", user.uid), {
        "logs": arrayUnion(log),
      });
      showToast("success", "Vendor Details Saved Successfully");
      setisEditable(true);
      navigate('/dashboard');
    }
  };

  // to get the prefilled form
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setuser(user);
      }
    });
  }, []);

  useEffect(() => {
    if (user?.uid) {
      onSnapshot(doc(db, "users", user?.uid), (doc) => {
        if (doc.data().forms?.vendorform > 0) {
          setisEditable(true);
        }
        setradioarray(doc.data()?.vendorTypes ? doc.data()?.vendorTypes : radioArray);
        setdata(doc.data());
      });
    }
  }, [user]);

  const printDivRef = useRef();

  return (
    <>
      <div ref={printDivRef} id="printDiv" className="p-4 w-full h-full rounded-lg border-gray-800 glass">
        <h3 className="text-white p-4 text-center text-uppercase lg:text-3xl md:text-xl">
          Vendor Registration Form
        </h3>
        <h3 className="text-white text-start text-uppercase text-lg border-b">
          To be completed by vendor
        </h3>
        <ol className="text-white text-sm list-decimal ps-4 mt-2 pb-2 border-b">
          <li className="p-1">
            <p className="font-light text-justify">
              Vendor must provide this form duly filled and duly signed by an
              authorized person. To be printed by Vendor on its own letter head.
              Incomplete form will be not accepted.
            </p>
          </li>
          <li className="p-1">
            <p className="font-light text-justify">
              The necessary attachments are mandatory and the registration form
              will not be accepted without all the required attachments.
            </p>
          </li>
          <li className="p-1">
            <p className="font-light text-justify">
              In order to set you up as a vendor in our system and to ensure
              timely processing of your invoice, we ask that you complete all
              required sections of this packet.
            </p>
          </li>
          <li className="p-1">
            <p className="font-light text-justify">
              Please note, all vendor invoices submitted for processing and
              payment will require a valid purchase order (issued by the buying
              contact at the Operating Company Agency you are contracting with).
              If the invoice does not reference a valid purchase order number,
              it will be returned to you and will not be processed for payment.
              There is a list of specific types of vendors for which purchase
              orders are not required that includes legal fees, travel costs,
              utility/office maintenance type costs, charitable donations,
              government tax payments or fees and others.
            </p>
          </li>
          <p className="font-bold text-danger text-justify">
            Forms must be signed and dated before submission. We prefer that you
            submit this form via email. If you are printing this form, please
            complete all fields before printing and ensure all the forms are
            approved before submission.
          </p>
        </ol>
        <div className="my-3 pb-3 text-white flex flex-col border-b">
          <label htmlFor="vendorType">Vendor Type</label>
          <div className="flex flex-row flex-wrap">
            {radioArray.map((radio, index) => (
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={radio.isChecked}
                  disabled={isEditable}
                  onChange={(e) => handleCheckbox(e, index)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  style={{ marginLeft: "5px", marginRight: "10px" }}
                  className="ml-5 text-sm font-medium text-gray-300"
                >
                  {radio.name}
                </label>
              </div>
            ))}
            <div className="d-flex justify-content-center align-items-top">
              <span className="text-sm">and Others</span>
              <input
                type="text"
                className="bg-transparent text-xs border-none border-bottom px-1 focus:shadow-none focus:outline-none h-5 ms-2"
              ></input>
            </div>
          </div>
        </div>
        <div id="printableDIV">
          <div
            className="accordion accordion-flush text-white"
            id="accordionExample"
          >
            <SectionOne
              isEditable={isEditable}
              user={user}
              vtype={radioArray}
            />
            {/* <div className="accordion-item my-2 rounded-none glass shadow-none">
              <h2 className="accordion-header" id="secTwo">
                <button
                  className="accordion-button bg-transparent collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSectionTwo"
                  aria-expanded="true"
                  aria-controls="collapseSectionTwo"
                >
                  <h3 className="text-white text-start text-uppercase text-lg ">
                    Section 2 - Vendor Bank Information
                  </h3>
                </button>
              </h2>
              <div
                id="collapseSectionTwo"
                className="accordion-collapse collapse"
                aria-labelledby="secTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body text-white">
                  <p className="font-light text-justify">
                    <strong>
                      <i className="fa-solid fa-circle-info" /> Note:{" "}
                    </strong>
                    Fill in the bank details by clicking{" "}
                    <a
                      href="/vendor-bankdetails"
                      className="text-primary underline"
                    >
                      here
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="accordion-item my-2 rounded-none glass shadow-none">
              <h2 className="accordion-header" id="secThree">
                <button
                  className="accordion-button bg-transparent collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSectionThree"
                  aria-expanded="true"
                  aria-controls="collapseSectionThree"
                >
                  <h3 className="text-white text-start text-uppercase text-lg ">
                    Section 3 - Omnicom Group Code of business Conduct for Vendors
                  </h3>
                </button>
              </h2>
              <div
                id="collapseSectionThree"
                className="accordion-collapse collapse"
                aria-labelledby="secThree"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body text-white">
                  <div className="my-3">
                    <p className="font-light text-justify">
                      Policy with respect to Anti-Bribary/ Foreign Corrupt
                      Practices Act/Conflict of Interest/non-compete clause etc
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item my-2 rounded-none glass shadow-none">
              <h2 className="accordion-header" id="secFour">
                <button
                  className="accordion-button bg-transparent collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSectionFour"
                  aria-expanded="true"
                  aria-controls="collapseSectionFour"
                >
                  <h3 className="text-white text-start text-uppercase text-lg ">
                    Section 4 - Document Checklist
                  </h3>
                </button>
              </h2>
              <div
                id="collapseSectionFour"
                className="accordion-collapse collapse"
                aria-labelledby="secFour"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body text-white">
                  <p className="font-light text-justify">
                    <strong>
                      <i className="fa-solid fa-circle-info" /> Note:{" "}
                    </strong>
                    Upload the documents by clicking{" "}
                    <a
                      href="/upload-documents"
                      className="text-primary underline"
                    >
                      here
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <SectionFive
              isEditable={isEditable}
              user={user}
            /> */}
            <SectionSix
              isEditable={isEditable}
              user={user}
            />

            {data && data?.forms && data?.forms?.vendorform == 0 && (
              <div className="my-3 d-flex ml-auto">
                <button
                  className="btn btn-primary rounded-lg w-100"
                  onClick={() => {
                    if (data?.vendorDetails && data?.vendorDetails?.sectionOne && data?.vendorDetails?.sectionFive && data?.vendorDetails?.sectionSix) {
                      setshowModal(true);
                    } else {
                      showToast("error", "Please fill and save all the sections to submit the form!");
                    }
                  }}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
        {data && data?.forms?.vendorform === 2 ?
          <>
            <ReactToPrint
              trigger={() => {
                return <button id="printbtn" className='rounded-lg bg-blue-800 text-white w-full p-2 my-3'>Print</button>
              }}
              onBeforeGetContent={() => {
                document.getElementById('printbtn').classList.add('d-none');
                document.getElementById('printDiv').classList.remove('glass');
                document.getElementById('collapseSectionOne').classList.add('show');
                document.getElementById('collapseSectionTwo').classList.add('show');
                document.getElementById('collapseSectionThree').classList.add('show');
                document.getElementById('collapseSectionFour').classList.add('show');
                document.getElementById('collapseSectionFive').classList.add('show');
                document.getElementById('collapseSectionSix').classList.add('show');
                document.getElementById('disableDiv').classList.add('d-none');
              }}
              onAfterPrint={() => {
                document.getElementById('printbtn').classList.remove('d-none');
                document.getElementById('printDiv').classList.add('glass');
                document.getElementById('collapseSectionOne').classList.remove('show');
                document.getElementById('collapseSectionTwo').classList.remove('show');
                document.getElementById('collapseSectionThree').classList.remove('show');
                document.getElementById('collapseSectionFour').classList.remove('show');
                document.getElementById('collapseSectionFive').classList.remove('show');
                document.getElementById('collapseSectionSix').classList.remove('show');
                document.getElementById('disableDiv').classList.remove('d-none');
              }}
              content={() => printDivRef.current}
              documentTitle="Vendor Data Form"
              pageStyle="print"
            />
          </>
          : ""}
      </div>
      <Termsandcondition
        title="Are you sure you want to submit it?"
        subtitle="I hereby declare that all the information given above is true and correct to the best of my knowledge"
        show={showModal}
        setrecall={setrecall}
        onClose={() => setshowModal(false)}
      />
    </>
  );
};

export default VendorDetails;
