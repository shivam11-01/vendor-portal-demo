import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { auth, db } from '../../../firebase.config';
import { formatDate } from '../../../utils/utils';
import { Spinner } from '../../reusable/spinner/Spinner'

const ExportNDA = () => {
    const [user, setuser] = useState()
    const [data, setdata] = useState()
    const [load, setLoad] = useState(true)
    const [sign, setsign] = useState()

    let date = formatDate("words");

    const pdfref = useRef(null);

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
                setTimeout(() => setLoad(false), 1500)
            });
            onSnapshot(doc(db, "documents", user.uid), (doc) => {
                const _tmp = doc.data()
                setsign(_tmp?.signImage);
                setTimeout(() => setLoad(false), 1500);
            });
        }
    }, [user])

    const handlePrint = () => {
        let printContents = document.getElementById('printableDIV').innerHTML;
        let originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    }

    const ComponentPrint = () => {
        return (
            <div ref={pdfref} id="printableDIV" style={{ height: "calc(100vh - 145px)", overflow: "auto", width: load ? "calc(100vw - 290px)" : "100%" }} className='scroll-hide w-full rounded-lg  bg-white text-black'>
                {load ?
                    <Spinner loader={load} className="dark" />
                    :
                    <div className='text-justify overflow-y-auto p-10'>
                        <p className='text-center'>
                            <b>NON-DISCLOSURE AGREEMENT</b>
                        </p>
                        <br />
                        <p>
                            This Non-Disclosure Agreement (“Agreement”) is effective on {date} (“<b>Effective Date</b>”) by and between:
                        </p>
                        <br />
                        <p>
                            <b>{data?.name || "Your Name"}</b>, a company incorporated under Companies Act, 1956/2013, having its registered office at {"address here"} (hereinafter referred to as “<b>First Party</b>” which expression shall, unless it be repugnant to the subject or context thereof include its successors and permitted assigns) of the <b>FIRST PART</b>.
                        </p>
                        <br />
                        <p>
                            <b>AND</b>
                        </p>
                        <br />
                        <p>
                            <b>Omnicom Media Group India Private Limited,</b> a Company incorporated under the provision of Indian Companies Act, 1956, having its Corporate Identity No. U74300MH1973PTC016583, its Registered Office at Omnicom a House, 3rd Floor, Opposite to Grand Hyatt, Santacruz East, Mumbai 400055 (hereinafter referred to as “<b>Second Party</b>” which expression shall, unless it be repugnant to the subject or context thereof include its successors and permitted assigns) of the <b>SECOND PART</b>.
                        </p>
                        <br />
                        <p>
                            <b>WHEREAS:</b>
                        </p>
                        <br />
                        <p>
                            We accordingly confirm that the above statements are true and correct and would continue to indemnify Omnicom Media Group India Private Limited to whom we have made supplies for any loss caused, due to any infirmity caused to them in this regard.
                        </p>
                        <br />
                        <p>
                            <li>First Party and the Second Party are considering whether they wish to enter into a business relationship in connection with a potential business opportunity relating to explore collaboration opportunities (“Purpose”) and wish to enter into this Agreement to assure the protection and preservation of the Confidential Information (as defined below) which may be disclosed to each other in connection with certain negotiations or discussions relating to the Purpose.</li>
                            <li>For the purposes of this Agreement “<b>Discloser</b>” means a Party supplying Confidential Information and “<b>Receiver</b>” means a Party receiving Confidential Information from the Discloser.</li>
                            <li>The Discloser and the Receiver shall individually be referred to as “Party” and collectively as “Parties”.</li>
                        </p>
                        <br />
                        <br />
                        <br />

                        <p>
                            <b>Article I Meaning of Confidential Information</b>
                        </p>
                        <br />
                        <p>
                            <b>1.1</b> Confidential information in the agreement, with respect to any Party, refers to any written or oral data, files and information (including but not limited to agreement, contract, memorandum and any negotiation record on any carrier) and any information or data owned by one party (possibly owned by some other individuals in the field) and not known by the public, which is marked as confidential or which would reasonably be regarded as confidential (“<b>Confidential Information</b>”). Any unauthorised disclosure, spreading or improper use of such information or data will damage the interests of the party (the discloser) whether the party (the discloser) has declared responsibility for the confidentiality of such information or data beforehand. Confidential Information includes but is not limited to information or data of one party reflected or recorded in written form, oral form or other visual forms or other carrier (such as electronic document, optical disk, magnetic disk, magnetic tape and video tape). It also includes the business, employee details, litigation details or company development strategy or the details about the products of the discloser. All references to Confidential Information shall include any part thereof.
                        </p>
                        <br />
                        <p>
                            <b>Article II Use of Confidential Information</b>
                        </p>
                        <br />
                        <p>
                            <b>2.1 </b>The receiver is entitled to only employ the Confidential Information for the purposes agreed to by both parties.
                        </p>
                        <br />
                        <p>
                            <b>2.2 </b>The receiver is entitled to only disclose Confidential Information to employees who need to know details of the Confidential Information. Moreover, the receiver shall ensure its employees are bound by at least the same level of confidentiality clauses in the agreement and shall bear liabilities if its employees breach relevant provisions of the agreement at any time under any circumstance.
                        </p>
                        <br />
                        <p>
                            <b>2.3 </b>The receiver shall take all reasonable measures, which are not inferior to measures taken to protect its own confidential information, to keep Confidential Information confidential. This aims to prevent Confidential Information being stolen, disclosed and/or used for unauthorized purposes or leaked arising from any carelessness of the third party.
                        </p>
                        <br />
                        <p>
                            <b>2.4 </b>Upon knowing Confidential Information is used or disclosed for an unauthorized purpose, the receiver shall inform the discloser at once and help the discloser take related corrective measures at its own expense.
                        </p>
                        <br />
                        <p>
                            <b>2.5 </b>Unless used for purposes stipulated by provision 2.1 and 2.2 of this Agreement and authorized by the discloser in writing beforehand, the receiver shall not wholly or partially copy or reprint the Confidential Information in any form. Any duplicated or reprinted copy of Confidential Information shall be clearly marked as possession of the discloser and with “Confidential”, “Private” or other similar words.
                        </p>
                        <br />
                        <p>
                            <b>Article III Exemption of Confidentiality Obligations</b>
                        </p>
                        <br />
                        <p>
                            However, Confidential Information does not include any information or data which:
                        </p>
                        <br />
                        <p>
                            <b>1) </b>The Confidential Information at the time of disclosure was or thereafter becomes publicly available without breach of this Agreement.
                        </p>
                        <p>
                            <b>2) </b>The Confidential Information has been disclosed or is being disclosed not due to a breach by the receiver of related provisions under the agreement (excluding the situation that the disclosure is caused by any third party after not fulfilling relevant confidentiality obligations);
                        </p>
                        <p>
                            <b>3) </b>Written testimonials prove that the Confidential Information has been lawfully acquired by the receiver before being disclosed by the discloser;
                        </p>
                        <p>
                            <b>4) </b>The receiver acquires the Confidential Information from a third party who is not bound by confidentiality obligations;
                        </p>
                        <p>
                            <b>5) </b>The Confidential Information is independently developed by the receiver.
                        </p>
                        <p>
                            <b>6) </b>The confidential information required to be disclosed by the Receiver, owing to any statue, rules, regulations, judicial/quasi judicial/government orders, shall give the Discloser of such confidential information a prompt written notice, where possible, of any such request or requirement to disclose, and shall use reasonable efforts to ensure that such disclosure is accorded confidential treatment and also fully cooperate in order to enable the Discloser, that seeks the non-disclosure of that information or data, to seek a protective order or other appropriate remedy at Discloser's sole cost:
                        </p>
                        <br />
                        <p>
                            <b>Article IV Rejection of Other Rights and Permissions</b>
                        </p>
                        <br />
                        <p>
                            <b>4.1 </b>The receiver shall not execute reverse engineering or reverse compilation to any Confidential Information or utilize the Confidential Information to get any intellectual property rights without prior written authorization of the discloser.
                        </p>
                        <br />
                        <p>
                            <b>4.2 </b>Disclosing Confidential Information and other related information by the discloser to the receiver under the agreement shall not constitute any grant of license, patent rights, copyrights, trademark rights and other proprietary or intellectual property rights except as expressly set forth herein.
                        </p>
                        <br />
                        <p>
                            <b>4.3 </b>The agreement shall not lead to any commercial agency and partnership between both parties, such as authorized product publicity and selling using and containing Confidential Information.
                        </p>
                        <br />
                        <p>
                            <b>Article V No Warranty to the Confidential Information</b>
                        </p>
                        <br />
                        <p>
                            All Confidential Information is provided “AS IS” and without any warranty, expressed or implied, or otherwise, as to the accuracy, completeness, performance or fitness for special purpose.
                        </p>
                        <br />
                        <p>
                            <b>Article VI Return and Destruction of the Information</b>
                        </p>
                        <br />
                        <p>
                            <b>6.1</b> All Confidential Information disclosed by the discloser to the receiver, including but not limited to document, diagram, model, equipment, sketch, design, list and any other tangible or intangible carriers of Confidential Information, are properties of the discloser. After the project in the agreement is completed or the agreement is cancelled or terminated, the receiver shall: (1) timely return or destroy all documents, duplicates and summary containing the Confidential Information; (2) eliminate all Confidential Information stored in computer and other equipment; (3) and provide a list of destroyed documents to prove that receiver has fulfilled two obligations as above in ten (10) days. Notwithstanding this, nothing in this agreement shall require the receiver to deliver up or accelerate the destruction of: (i) any network back-ups which may contain copies of Confidential Information; or (ii) any network shadow-copies, in each case recorded in the ordinary course of business. Any Confidential Information so retained by the receiver shall be subject to an ongoing obligation of confidentiality as per the terms of this agreement.
                        </p>
                        <br />
                        <p>
                            <b>6.2</b> Even after the Confidential Information has been returned or destroyed, the receiver and its employees shall still be restricted by the agreement till the confidentiality term under the agreement expires.
                        </p>
                        <br />
                        <p>
                            <b>Article VII Confidentiality Term</b>
                        </p>
                        <br />
                        <p>
                            <b>7.1</b> The obligations under this Agreement of each Party will continue and be binding for a period of One (1) year, irrespective of whether the discussion between the Parties materialize into a specific understanding/business relationship or not and continue for a further period of One (1) years after expiry or termination of this Agreement.
                        </p>
                        <br />
                        <p>
                            <b>7.2</b> Confidentiality liabilities under the agreement shall not be terminated along termination of this agreement or other agreements.
                        </p>
                        <br />
                        <p>
                            <b>Article VIII Applicable Laws and Dispute Resolutions</b>
                        </p>
                        <br />
                        <p>
                            The agreement and execution of the agreement shall be subject to relevant laws of the India. All disputes arising out of or in connection with this Agreement which are not settled amicably between the parties shall be submitted to Arbitration for settlement as per the Arbitration and Conciliation Act, 1996 by appointing a sole Arbitrator by the mutual consent of both the parties. The place of arbitration shall be at Mumbai. The arbitral award shall be conducted in English language. The arbitral award shall be final and binding upon the parties.
                        </p>
                        <br />
                        <p>
                            The Courts at Mumbai will have the exclusive jurisdiction over the matter.
                        </p>
                        <br />
                        <p>
                            <b>Article IX Other Regulations</b>
                        </p>
                        <br />
                        <p>
                            <b>9.1</b> Rights and obligations under the agreement shall not be transferred or assigned without prior written consent of the other party.
                        </p>
                        <br />
                        <p>
                            <b>9.2</b> The Parties acknowledges that due to the unique nature of the Confidential Information, any breach of its obligations hereunder will result in irreparable harm to parties therefore, upon any such breach or threat thereof, parties shall be entitled to appropriate equitable relief including the relief of injunction, in addition to any other remedies available at law.
                        </p>
                        <br />
                        <p>
                            <b>9.3</b> The agreement contains all understandings towards its details. In case of any contradiction of the agreement with related negotiations, letters and stipulations before the agreement is signed, the agreement shall prevail.
                        </p>
                        <br />
                        <p>
                            <b>9.4</b> Any amendment or supplementation to the agreement shall be subject to supplementary agreement signed between both parties. Otherwise, it is invalid.
                        </p>
                        <br />
                        <p>
                            <b>9.5</b> The situation that the discloser has not executed its rights or has delayed to execute its rights shall not constitute surrender of the rights. Any independent or partial execution of the rights shall not interfere with other rights or further execution of other rights.
                        </p>
                        <br />
                        <p>
                            <b>9.6</b> An invalid clause under the agreement according to relevant laws has no impact on validity of other clauses under the agreement. Both the discloser and the receiver shall agree to substitute with a clause mostly similar with the invalid clause in terms of purpose and economic benefit. However, such substitution shall not deprive one party or both parties from tangible interests under the agreement.
                        </p>
                        <br />
                        <p>
                            <b>9.7</b> The agreement is signed in duplicate. Each party holds one copy and both copies have the same legal effect.
                        </p>
                        <br />
                        <p>
                            <b>9.8</b> The agreement shall take effect after being signed and affixed with seal by both parties. Upon any difference in date of signing, the final date shall prevail.
                        </p>
                        <br />
                        <p className='text-center'>
                            <b><i>[Signature Page Follows]</i></b>
                        </p>
                        <br />
                        <div className='d-flex justify-between'>
                            <p><b>{data?.name || "Your Name"}</b></p>
                            <p><b>For Omnicom Media Group India Pvt. Ltd.</b></p>
                        </div>
                        {sign ? <img src={sign} alt="Signature" className="signImage my-2 ms-3" /> :
                            <>
                                <br />
                                <br />
                                <br />
                            </>}
                        <div className='d-flex justify-between'>
                            <p><b>Authorised Signatory</b></p>
                            <p className='d-flex flex-col'>
                                <b>Name: Raghuraaman Jankiraman</b>
                                <b>Designation: AVP- Finance</b>
                            </p>
                        </div>
                    </div>
                }
            </div>
        )
    };

    return (
        <>
            <div>
                <ComponentPrint />
                <button className='rounded-lg bg-blue-800 text-white w-full p-2 my-3' onClick={handlePrint}>Print</button>
            </div>
        </>
    )


}

export default ExportNDA