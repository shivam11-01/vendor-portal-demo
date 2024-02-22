import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { auth, db } from '../../../firebase.config';
import { updateDocument } from '../../../utils/api';
import { showToast } from '../../../utils/toast';
import { formatDate } from '../../../utils/utils';
import { Spinner } from '../../reusable/spinner/Spinner'

const ExportNDA = () => {
    const [user, setuser] = useState()
    const [data, setdata] = useState()
    const [load, setLoad] = useState(true)
    const [sign, setsign] = useState()
    const dateRef = useRef();

    const pdfref = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => pdfref.current,
        onBeforeGetContent: () => {
            pdfref.current.style.height = "100%";
            document.getElementById('padng').style.paddingBottom = "39rem";
        },
        onAfterPrint: () => {
            pdfref.current.style.height = "calc(100vh - 145px)";
            document.getElementById('padng').style.paddingBottom = "auto";
        }
    });

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

    const ComponentPrint = () => {
        return (
            <div ref={pdfref} id="printableDIV" style={{ height: data?.forms?.msa === 2 ? "calc(100vh - 145px)" : "calc(100vh - 80px)", overflow: "auto", width: load ? "calc(100vw - 290px)" : "100%" }} className='scroll-hide h-full w-full rounded-lg  bg-white text-black'>
                {load ?
                    <Spinner loader={load} className="dark" />
                    :
                    <div id="padng" className='text-justify text-sm overflow-y-auto p-10'>
                        <br />
                        <br />
                        <p className='text-center font-bold text-2xl'>
                            <b>MASTER SERVICE AGREEMENT</b>
                        </p>
                        <br />
                        <br />
                        <p>
                            This Master Service Agreement (“Agreement”) is effective on {formatDate("words", data?.msa?.date)} (“<b>Effective Date</b>”) by and between:
                        </p>
                        <br />
                        <p>
                            <b>Omnicom Media Group India Private Limited,</b> through its division <b>{data?.msa?.division}</b>, a company,registered under the Companies Act, 1956, having its Corporate Identity No. U74300MH1973PTC016583 and having its registered office at <b>{data?.msa?.address}</b>, (hereinafter referred to as the “Client” which expression shall include its successors and assigns) of the <b>ONE PART;</b>.
                        </p>
                        <br />
                        <p>
                            <b>AND</b>
                        </p>
                        <br />
                        <br />
                        <p>
                            <b>{data?.name || "Your Name"}</b>, a company registered under Companies Act, 1956/2013, having its Corporate Identity No. <b>{data?.msa?.cinnumber}</b> and its registered office at <b>{data?.address}</b> (hereinafter referred to as “<b>Service Provider</b>” which expression shall include its successors and permitted assigns) of the <b>OTHER PART</b>.
                            <br />
                            <br />
                            <b>“Client”</b> and <b>“Service Provider”</b> are hereinafter collectively referred to as the <b>“Parties”</b> and individually as a <b>“Party”.</b>
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
                            <b>A.</b>	Client is in the business of media investment management & operations including digital media planning, buying, implementation and providing allied services to its various clients;
                            <br />
                            <br />
                            <b>B.</b>	The Service Provider is in the business of advertising, marketing, and promotional services, including and has represented to Client that it has the necessary infrastructure, expertise, experience, skills, knowledge and manpower to provide the Services (as defined hereinafter) as per the requirement of the Client under this Agreement;
                            <br />
                            <br />
                            <b>C.</b>	Pursuant to the representation given by the Service Provider and the discussions and negotiations held between the Parties, the Client is desirous of procuring the Services of the Service Provider for its customers from time to time, during the Term subject to the terms and conditions recorded hereinafter.
                            <br />
                            <br />
                        </p>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <p className='text-center text-xl'>
                            NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:
                        </p>
                        <br />
                        <br />
                        <p>
                            <b>1. DEFINITIONS:</b>
                        </p>
                        <p>
                            For the purpose of this Agreement the following meanings shall be ascribed to the following words save and except where otherwise expressly specified:
                        </p>
                        <br />
                        <p>
                            <b>1.1   “Agreement”</b> means this entire Agreement and any Schedule(s), Annexure(s), Addendum(s), PO(s), RO(s), Statement of Work(s) forming part of this Agreement;
                        </p>
                        <br />
                        <p>
                            <b>1.2   “Confidential Information"</b> shall mean all information shared by Client with the Service Provider during the Term or before pertaining to itself and/or its customers and includes but is not limited to this Agreement, all know-hows, ideas, designs, documents, concepts, technology, manufacturing processes, industrial, marketing, commercial knowledge, trade secrets, copyright, trademarks, patent and ancillary information and other proprietary or confidential information regardless of form, format, media including without limitation written or oral information and also includes information communicated or shared through discussions, telephone conversations, meetings, documents, correspondence or inspection of tangible items, facilities or inspection at any site or place including without limitation.
                        </p>
                        <br />
                        <p>
                            a)	Research, development or technical information, confidential and proprietary, information on products, intellectual property rights;
                            <br />
                            b)	Business plans, operations or systems, financial and trading positions;
                            <br />
                            c)	Details of customers, suppliers, debtors or creditors;
                            <br />
                            d)	Information relating of the officers, directors or employees of the Client or its customers and its related corporations;
                            <br />
                            e)	Discussions, dialogues, media (planning & buying) plan and rates, media strategies;
                            <br />
                            f)	Marketing information, brochures, printed matter, rates and rate tables;
                            <br />
                            g)	Formulae, patterns, compilations, programs, devices, methods, techniques, or processes that derive independent economic values, actual or potential form not being generally known to the public.
                            <br />
                        </p>
                        <br />
                        <p>
                            <b>1.3   "Client Affiliate/s”</b>  shall mean any and all group companies, affiliates, subsidiaries, agencies and divisions of such group companies of the Client in existence from time to time
                            <br />
                            <br />
                            <b>1.4	 “Personnel”</b> means the employees and professionals of the Service Provider who are engaged to render Services/ Deliverables under the terms and conditions of this Agreement;
                            <br />
                            <br />
                            <b>1.5	 “Services”</b>  means the services to be provided by the Service Provider as detailed under Clause 3 of this Agreement.
                            <br />
                            <br />
                            <b>1.6	 “Deliverables”</b>  means the deliverables required to be delivered by the Service Provider as per the SOW or Purchase Order or through written order or communication as issued by the Client.
                            <br />
                            <br />
                            <b>1.7	 Micro, Small & Medium Enterprises (“MSME”)</b> means micro, small and medium scale enterprises as defined under The Micro, Small and Medium Enterprises Development Act, 2006.
                            <br />
                        </p>
                        <br />
                        <p>
                            <b>1.8	 "Material Breach"</b> shall mean:
                            <br />
                            a)	Any assurances, covenants or representations and warranties of either Party recited or setout herein being discovered to be incorrect, or sought to be retraced, or Service Provider committing a breach of the same;
                            <br />
                            b)	Commencement of any winding up/liquidation/insolvency proceedings in respect of the either Party (or any of its directors/partners, as the case maybe);
                            <br />
                            c)	Breach by Service Provider of its’ obligations stated under this Agreement or any terms or conditions stated under this Agreement that remains uncured at the end of a 7 (seven) days cure period in accordance with the terms of this Agreement.
                            <br />
                            <br />
                        </p>
                        <p className='text-lg font-bold'>
                            2.	TERM:
                            <br />
                        </p>
                        <p>
                            2.1	This Agreement shall commence from the Effective Date i.e. ___________________ from and shall remain valid unless terminated in accordance with the terms mentioned herein. Accordingly, all such Services/Deliverables shall be completed to the satisfaction of the Client within the stipulated timelines. Time is the essence of this Agreement. This Agreement can be renewed further on mutually agreed terms and conditions between the Parties.
                        </p>
                        <br />
                        <p className='text-lg font-bold'>
                            3.	SCOPE OF SERVICES:
                            <br />
                        </p>
                        <p>
                            <b>3.1</b>	  Service Provider will provide the Client and/or Client Affiliate with the Services and/or Deliverables as may be required by the Client from time to time by issuing either a Purchase Order (“PO”) or executing a Statement of Work (“SOW”) or through written order or communication. All such POs or SOWs or written orders or communications as issued by the Client will be part of this Agreement. Each Client Affiliate which submits Release Order  RO(s) to the Service Provider forms a separate agreement with the Service Provider (an <b>"Agreement"</b>) which comprises these terms together with all ROs submitted by that Client Affiliate to the Service Provider. All references to Client in these terms shall be deemed to be references to the specific Client Affiliate submitting the relevant RO. Services may also include any event or occasion organized and/or managed by the Service Provider from time to time for sponsorship, activation or otherwise <b>“(Event”/ “Activity)”.</b>
                            <br />
                            <br />
                            <b>3.2</b>  The Service Provider shall perform the services for the Client in connection with branding, advertising, marketing, and creative, Materials  as provided in the PO, RO, and SOW from time to time;
                            <br />
                            <br />
                            <b>3.3</b>	Delivery of the Deliverables and/or Services must be effected within the timeline stated either in the SOW or the PO or such written order or communication, failing which the order of the required Services and/or Deliverables may be cancelled with immediate effect at the sole discretion of the Client;
                            <br />
                            <br />
                            <b>3.4</b>  In case of any such cancelation as mentioned in the above clause, all the payments already made to the Service Provider by the Client shall be returned by/recovered from the Service Provider. Further, the Client reserves the right to purchase the said Deliverables and/or Services from another vendor. The Service Provider shall be liable to pay any loss incurred by the Client for such failure of Services and/or Deliverables by the Service Provider;
                            <br />
                            <br />
                            <b>3.5</b>  The Client has right to set-off, at its sole discretion from the Service Provider’s invoices such amount that the Client has spent to procure such services/deliverables from the market and/or any loss resulting on account of such delay and/or cancellation as the circumstances may warrant. This right of the Client shall be without prejudice to any other rights/remedies available to the Client under the law;
                            <br />
                            <br />
                            <b>3.6</b>  Service Provider shall provide the Services and/or Deliverables strictly in accordance with the specification made by the Client;
                            <br />
                            <br />
                            <b>3.7</b>	The Services and/or Deliverables delivered are subject to Client’s inspection and all such Services and/or Deliverables may be rejected for inferior quality, untimely delivery and/or failure to satisfy the specifications as mentioned by the Client;
                            <br />
                            <br />
                            <b>3.8</b>  The Client shall not be liable to pay the Service Provider for Services and Deliverables failed to deliver as per the specification of the Client. Further, in case of failure to deliver any product or material as per Client’s requirement, the Service Provider shall refund the entire money already paid for such product or materials;
                            <br />
                            <br />
                            <b>3.9</b>	Decision of Client with respect to the above clauses will be final and binding on the Service Provider.
                        </p>
                        <br />
                        <br />
                        <p className='text-lg font-bold'>
                            4.	COMPENSATION TERMS, INVOICING, PAYMENTS AND TAXES:
                            <br />
                        </p>
                        <p>
                            <b>4.1</b>	In consideration for the Services/Deliverables rendered by Service Provider under this Agreement, the Client shall pay to Service Provider the charges payable as agreed as mentioned in the SOW or PO or under such written order or communication. The amounts may be revised as mutually agreed in writing by the Parties from time to time;
                            <br />
                            <br />
                            <b>4.2</b>  Service Provider will be required to submit all its invoices within 30 (thirty) days of delivery of goods or completion of services, as the case may be, failing which the Service Provider is required to submit a fresh invoice with the current date as the previously submitted invoice will be treated as null and void. Any non-compliance in this regard from the Service Provider’s end will result in non-payment of the service charge;
                            <br />
                            <br />
                            <b>4.3</b>	Unless otherwise mentioned in any purchase order/release order, the payment of undisputed invoices shall be made by the Client to the Service Provider as per the below terms:
                            <br />
                            <br />
                            <b>a)</b>	For MSME registered service provider: all undisputed invoices shall be payable within 45 days from the date of acceptance of the invoices**, subject to the Service Provider submitting MSME registration certification at the time of empanelment.
                            <br />
                            <br />
                            <b>b)</b>   For Non-MSME vendors 90 days the from date of acceptance of the invoice, subject to receipt of payments from the end client unless mutually agreed to different payment terms in SOW/RO executed/issued for each activity.
                            <br />
                        </p>
                        <br />
                        <p>
                            ** Acceptance of invoice: An invoice will be considered as accepted by the Client when all the below criteria’s are fulfilled:
                            <br />
                            <br />
                            i.	Upon successful delivery of the Services;
                            <br />
                            ii.	Upon Client and/or end client of the Client in writing accept/confirms the Deliverables/Services provided by the Service Provider;
                            <br />
                            iii.	Upon submitting valid and correct tax invoice with all the required details including Purchase Order number, GST details, project/campaign/activity details, description of Services/Deliverables etc.
                            <br />
                            iv.	Until the reconciliation process has been completed in respect of the subject matter of such invoice.
                            <br />
                            <br />
                            Once all the above criteria are completed and fulfilled, the Client will communicate the acceptance of the invoice which shall be considered as the date of acceptance of the invoice.
                            <br />
                            <br />
                            The invoices and challans must contain the reference of Client’s order otherwise such Deliverables and invoice may be rejected or if accepted payment of service charge for such Deliverables is to be made at the sole discretion of the Client. The said service charge will include all costs towards rendering such Services/Deliverables including employee cost, maintenance, support, routine up-keep, all direct expenses, all taxes, duties, levies except the goods and services tax (“GST”) and the Client will approve the payment based on confirmation of Services/Deliverables rendered versus Services/Deliverables ordered;
                            If payment to Service Provider is dependent on Client getting the payment from the end customer, then all payment to Service Provider shall be made post the Client receives its payment from the end customer. Client shall not be held liable and responsible if the end customer delays in making payment;
                        </p>
                        <br />
                        <p>
                            <b>4.4</b>	Service Provider shall raise an invoice on the Client only on the address and other details communicated by the Client at the time of issuing the Release Order and/or Purchase Order, failing which, Service Provider shall be liable and responsible to indemnify the Client for any input tax credit loss suffered by the Client;
                            <br />
                            <br />
                            <b>4.5</b>	The Service Provider may receive all Out of Pocket Expenses (OPE) from Client for which necessary approvals from Client in writing have been obtained before incurring such OPE. All OPE shall be reimbursed only on production of original vouchers and such other documents in support thereof as may be reasonably required by the Client;
                            <br />
                            <br />
                            <b>4.6</b>	It is understood and agreed by the Service Provider that payment shall be due and payable only in consideration for timely and accurate performance of the Services/Deliverables by the Service Provider;
                            <br />
                            <br />
                            <b>4.7</b>	Other than the service charge as per clause 4.1 and OPE mentioned above, the Service Provider shall neither claim nor the Client shall consider any other charges, compensation, benefits, privileges, allowances etc. unless and until prior approval of the same is obtained from the Client in writing;
                            <br />
                            <br />
                            <b>4.8</b>	The Client shall be entitled to set off against and deduct and recover from the aforesaid service charge and any other sums payable by the Client to Service Provider at any time, any tax levy or any other amount whatsoever which may be required to be deducted by order of any Court/Authority under any law, as also all amount which may be or become payable by Service Provider to the Client under this Agreement.
                            <br />
                            <br />
                        </p>
                        <p className='font-bold'>
                            4.9	TAXES
                            <br />
                            <br />
                        </p>
                        <p>
                            <li> Parties agree that any taxes as applicable on this Agreement or in respect of the payment of the Consideration under this Agreement shall be paid as per the applicable laws.</li>
                            <br />
                            <li> The Parties herein expressly agree that amount of stamp duty/registration charges if any payable in respect of this Agreement shall be borne solely by the Service Provider.</li>
                            <br />
                            <li>	With regards to any payment to be made by Client to  Service Provider under this agreement shall be subject to withholding Tax Deduction at Source (“TDS”) at the prevailing rate as per provisions of Income Tax Act 1961 and promptly deliver to Service Provider certificates evidencing such withholding by Client</li>
                            <br />
                            <li>	In case Service Provider is eligible for lower rate of tax, Service Provider is responsible to provide the requisite details, documents or declarations for the purpose of tax lower tax rates. In absence of this, lower rates would not be extended. Further, in case of any incorrect/incomplete / non-compliance on behalf of Service Provider and because of which a demand is made on Client by the tax authorities, Service Provider shall be immediately liable to pay the applicable taxes/amounts (including interest, penalty, and associated litigation cost) if any upon notification by Client.</li>
                            <br />
                            <li>	Service Provider undertakes and agrees that it shall register itself under the Central Goods and Services Tax Act, 2017 (CGST Act), the State Goods and Services Tax (SGST) Act, 2017, Integrated Goods and Services Tax (IGST) Act, 2017, Union Territory Goods and Service Tax (UTGST) Act, 2017 (hereinafter individually/collectively called as “GST Law”)  and any other taxes levied under the GST law as may be applicable to it and also ensure that the eligible tax credits are made available to Client.</li>
                            <br />
                            <li>	The client shall provide the GST registration number to Service Provider to be mentioned on the invoice.</li>
                            <br />
                            <li>	Service Provider shall ensure that invoices issued to the Client shall contain Invoice Reference No. (IRN) and Quick Reference Code (QR Code) generated from Government E-invoicing Portal as required by the E-invoicing provision of GST Law. If E-invoicing is not applicable as per the prescribed GST Law, the Service Provider shall submit to Client Declaration in prescribed form.</li>
                            <br />
                            <li>	Service Provider shall issue proper tax invoice(s) or documents which are in compliance with the applicable Indirect tax legislation (including GST) from timing as well as content perspective and also to enable Client fill in the details as required in the returns prescribed under necessary legislation including GST.</li>
                            <br />
                            <li>	In case of any reverse charges is payable by Client under domestic reverse charges provisions, Service Provider shall not charge the same on its invoice. If such tax is charged on its invoice, the said reverse charges shall not be paid to Service Provider and the same will be deposited by Client directly with the government under reverse charge mechanism.</li>
                            <br />
                            <li>	Service Provider to ensure timely payment of taxes and filing of GST returns within the time limit specified in the GST law to ensure smooth flow of credit to Client. The client will hold the GST amount till Service Provider files GST Returns (GSTR-1 & GSTR-3B) and the Client is able to claim the input tax credit (as per GSTR-2B/2A).</li>
                            <br />
                            <li>	Any disputes arising on account of GST input tax credit shall be mutually resolved within the timelines prescribed under the GST law. In case disputes are not resolved within time, the Client shall hold the payment to Service Provider to the extent of GST under dispute.</li>
                            <br />
                            <br />
                        </p>
                        <p className='text-lg font-bold'>
                            5.	DUTIES AND OBLIGATIONS OF SERVICE PROVIDER:
                            <br />
                        </p>
                        <p>
                            5.1	The Service Provider shall take reasonable care to ensure that it always acts with due diligence and care and shall not, without the prior written permission of Client, sub-contract or appoint any agent to fulfill its obligations under this Agreement.
                            <br />
                            <br />
                            5.2	The Service Provider shall assign a team qualified and capable of delivering the Services/Deliverables elucidated in this Agreement;
                            <br />
                            <br />
                            5.3	Service Provider may require to depute Personnel at Client premises for performing the Services under this Agreement as per the scope of work.
                            <br />
                            <br />
                            5.4	It is the responsibility of the Service Provider to recruit suitable Personnel, if required, for providing Services to the Client under this Agreement and such Personnel of Service Provider shall always be treated as the employees of Service Provider only.  The Client shall not have any responsibility to nor shall be held directly or indirectly responsible or liable for the Personnel so employed by the Service Provider for performing/providing Services to the Client in terms of its contractual obligations hereunder. Such Personnel shall remain in the Client’s premises only during their duty hours as assigned to them by the Service Provider and solely during the duration of this Agreement;
                            <br />
                            <br />
                            5.5	Service Provider will ensure the Personnel so deputed are not barred from working in India. The Client will not be liable to any cost / damages / penalties, statutory or otherwise, arising out of the Personnel assigned by the Service Provider at the Client’s offices;
                            <br />
                            <br />
                            5.6	If the Client is not satisfied with the performance of the Personnel, then as per Client’s requirement, the Service Provider shall immediately within 5 (five) working days of request of the Client replace such Personnel without any cost;
                            <br />
                            <br />
                            5.7	It shall be the duty of Service Provider to clearly inform its Personnel that they will have no claim whatsoever on the Client and shall not raise any labour and industrial dispute, either directly or indirectly, with or against the Client, in respect of any of their service conditions or otherwise. In the event of any such claims/disputes, the Service Provider agrees to indemnify the Client against any cost, damages, penalties incurred by the Client within 30 days of such claim;
                            <br />
                            <br />
                            5.8	Service Provider shall comply with all applicable laws with regard to the Services and/or Deliverables provided by it under the terms and conditions of this Agreement and shall directly deal with all such Government authorities for the same. Whenever asked for by the Client, Service Provider shall furnish all documents to prove their compliance of all applicable laws and payment of taxes and duties in connection to the same;
                            <br />
                            <br />
                            5.9	The Service Provider warrants that the Deliverables and Services provided by the Service Provider in accordance with the terms of this Agreement shall not infringe the Intellectual Property Rights of any third party or any personal, publicity or privacy rights. The Service Provider further warrants that such Services and/or Deliverables shall not be in violation of any statute, ordinance or regulation or that the same shall not be defamatory, libelous, obscene, against public morality or contain any viruses, Trojans or other computer programs intended to damage or intercept or expropriate any system, data or personal information;
                            <br />
                            <br />
                            5.10	The Service Provider further warrants that there is no outstanding contract, commitment or agreement to which the Service Provider is a party or any legal impediment which conflicts with this Agreement or may limit, restrict or impair the rights granted to the Client hereunder;
                            <br />
                            <br />
                            5.11	The Service Provider further warrants that all Deliverables under the Agreement and the Services to be performed thereunder shall be provided in a workmanlike manner and with due professional diligence, skill and highest industry standard. Such Deliverables and Services shall conform to the specifications and requirements of the Client;
                            <br />
                            <br />
                            5.12	The Service Provider shall provide the name of authorized representative in writing who would be the single point of contact for all communications in relation to Services and/or Deliverables;
                            <br />
                            <br />
                            5.13	The Service Provider shall provide weekly reports for review and discussion;
                            <br />
                            <br />
                            5.14	The Service Provider or its Personnel shall not represent themselves to be an agent/employee of Client to any third party in any manner whatsoever and the Personnel shall at all-time be represented as personnel of the Service Provider.
                            <br />
                            <br />
                            5.15	The Service Provider shall provide all the marketing materials, content, and tools (“Materials”) in consonance with the requirements of the Client;
                            <br />
                            <br />
                            5.16	The Service Provider shall provide all technical assistance with respect to the installation and maintenance of any hardware/software tools as may be required by the Client for performance of the Services at no additional cost;
                            <br />
                            <br />
                            5.17	The Service Provider shall submit the Materials to the Client within the timeframe as set out in the SOW and are to be placed only upon explicit approval by the Client and the Service Provider shall not use these Materials for any commercial gain and provide the Services only for the purposes intended through this Agreement;
                            <br />
                            <br />
                        </p>
                        <p className='text-lg font-bold'>
                            6.	CONFIDENTIALITY:
                            <br />
                        </p>
                        <p>
                            6.1.	The Service Provider shall not disclose, publish, or disseminate Confidential Information to anyone other than those of its Personnel & office bearers on a need to know basis only and for the purpose of and in connection with the provision of Services, and the Service Provider agrees and undertakes to take best precautions to prevent any unauthorized use, disclosure, publication, or dissemination of Confidential Information;
                            <br />
                            <br />
                            6.2.	The Service Provider further agrees to inform each of its Personnel and officer bearers to whom Confidential Information is disclosed, for whom they shall be liable in case of breach of this Agreement, of the restrictions as to use and disclosure of Confidential Information contained herein and shall ensure that each such Personnel and officer bearers shall observe such restrictions;
                            <br />
                            <br />
                            6.3.	If the Service Provider or any of its Personnel / office bearer have a legal obligation to disclose any Confidential Information, the Service Provider shall, to the extent legally permitted, immediately give Client prior notice of such obligation in order to enable Client to take all protective measures or actions;
                            <br />
                            <br />
                            6.4.	The Service Provider agrees to accept Confidential Information for the sole purpose of providing Services and/or Deliverables. The Service Provider agrees not to use Confidential Information otherwise for its own, or any third party’s benefit. The Service Provider agrees to notify Client promptly in writing of any misuse or misappropriation of Confidential Information which may come to its attention;
                            <br />
                            <br />
                            6.5.	The obligations set forth in this Clause 6 shall survive termination of this Agreement;
                            <br />
                            <br />
                            6.6.	Upon written request of the Client at any time during the term or upon termination of this Agreement, the Service Provider shall:
                            <br />
                            <br />
                            i)	promptly return all Confidential Information (or the part thereof required in such request), including copies, to the Client in a format and on media reasonably requested by the Client; or
                            <br />
                            ii)	destroy the Confidential Information (including copies) in manner specified by the Client, other than such copies required to be kept by the Service Provider by law and promptly certify to the Client in writing that it has done so.
                            <br />
                        </p>
                        <br />
                        <br />
                        <p className='text-lg font-bold'>
                            7.	APPROVALS:
                            <br />
                        </p>
                        <p>
                            7.1   Service Provider shall not commence, amend, alter and terminate Services/Deliverables or any part thereof, without prior written confirmation of Client which may be in the form of estimates, release orders, SOWs, or simple email communication from Client’s official representative through their official email ids only.
                        </p>
                        <br />
                        <br />
                        <p className='text-lg font-bold'>
                            8.	REPRESENTATION AND WARRANTIES::
                            <br />
                        </p>
                        <p>
                            8.1.	Each Party represents and warrants to the other Party that:
                            <br />
                            <br />
                            a)	It is competent and free to enter into this Agreement and perform its obligations as set out herein;
                            <br />
                            b)	It is not under any disability, restriction or prohibition, whether contractual or otherwise, which might restrict or prevent it from performing or observing any of its obligations under this Agreement.
                            <br />
                            <br />
                            8.2.	The Service Provider further represents that it has valid and subsisting license, authority, permission and approvals required for providing Services and/or Deliverables hereunder. It also warrants that it shall keep them valid and subsisting during the Term of the Agreement;
                            <br />
                            <br />
                            8.3.	The Service Provider represents and warrants that it shall not do or permit or cause to do any act or thing that may damage, impair or otherwise prejudice the reputation, status or image of Client or of its end customer;
                            <br />
                            <br />
                            8.4.	The Service Provider represents and warrants that it has necessary expertise, infrastructure and adequate personnel to perform the Services and acknowledges that time shall be an essence of the Agreement in performance of the Services;
                            <br />
                            <br />
                            8.5.	The Service Provider shall not claim ownership over the Services and/or Deliverables and shall not showcase the same in any public media, forum, competition as its own creation, without prior written consent of Client;
                            <br />
                            <br />
                            8.6.	In case the performance/ execution/delivery of any of the Services or Deliverables require specific approvals or licenses, it shall be the Service Provider’s obligation to obtain the approvals/ licenses required without any additional cost charged to the Client;
                            <br />
                            <br />
                            8.7.	The Service Provider warrants that it has the necessary intellectual property rights including copyright/ license/ authority to use the software/hardware for the performance of the Services/Deliverables and the same shall not be in violation of the intellectual property rights of any third party.
                            <br />
                            <br />
                            8.8.	Service Provider at all times, shall ensure to comply with the data safety and hygiene policy of as required to conduct the Activity/Event;
                            <br />
                            <br />
                            8.9.	Service Provider undertakes to send complete report of the Event/Activity along with the photographs as applicable as proof of conducting the Event/Activity and delivery of the Deliverables;
                            <br />
                            <br />
                            8.10.	Service Provider shall strictly adhere to the instructions issued by Client and/or end client of Client from time to time for conducting the Event/Activity and delivering the Deliverables;
                            <br />
                            <br />
                            8.11.	Service Provider shall be liable for taking all licenses, approvals, permissions, consents and other necessary clearances from the required statutory and/or non-statutory bodies for the purpose of conducting the said Activity/Event.
                            <br />
                            <br />
                            8.12.	Service Provider shall be solely responsible for any liability or third-party claims arising out of the Activity/Event. In no event shall Client and or the end client of the Client be liable for any loss, damage, cost, claim including for death or injury sustained by any individual associated with the Activity/Event in any manner whatsoever at any stage of the activity pertaining to the execution of the Activity/Event.
                            <br />
                            <br />
                        </p>
                        <p className='text-lg font-bold'>
                            9.	INTELLECTUAL PROPERTY:
                            <br />
                        </p>
                        <p>
                            9.1.	It is agreed that the Services and/or Deliverables shall be considered to be commissioned or specially ordered by the Client and shall be owned by the Client throughout the world and in perpetuity. d To the extent that the Client is not deemed to be the owner of the Deliverables or any parts thereof in any part of the world, the Service Provider hereby grants and assigns all rights, title, and interest, including but not limited to rights in any form of intellectual property and rights in all forms of exploitation, to the Client, for the territory of the world and in perpetuity, from the moment of creation of the Deliverables/Services or any parts thereof. Any material provided by the Client shall not form a part of the Deliverables for the purposes of the assignment and license to the Client herein. The provisions of section 19(4) of the Copyright Act, 1957 (as amended), shall not apply to the assignment and license to the Client herein;
                            <br />
                            <br />
                            9.2.	Except as otherwise expressly provided in this Agreement, the Service Provider warrants that it has obtained or will in due time obtain all rights, relating to the use of any intellectual property which may be required for the purpose of this Agreement, without requiring any assistance from the Client. The Client shall not be obliged to enter into any further Agreement with the Service Provider or any third party in respect of the use of such intellectual property;
                            <br />
                            <br />
                            9.3.	Client will own all rights, title and interests in and to any and all software, information, materials, property, products, Services, Deliverables that is or are created or acquired independently by the Service Provider specifically for the Client towards its obligations pursuant to this Agreement;
                            <br />
                            <br />
                            9.4.	Except as provided for in this Agreement, neither Party shall acquire a right to use, and shall not use without the other Party’s prior written permission in each instance, the names, characters, artwork, designs, trade names, trademarks, or service marks of the other Party in advertising, client list, publicity, public announcement, press release or promotion, or in any manner tending to imply an endorsement of the other Party’s products or services;
                            <br />
                            <br />
                            9.5.	The Service Provider accepts that for all purposes any trademarks, logos, service marks, trade names or identifying slogans affixed or used by Client or any of Client Affiliates or end customer, whether registered or not, constitute the exclusive property of Client or Client Affiliates or its end customer and cannot be used except in connection with the Services or Deliverables and without the prior written consent of the Client. The Service Provider’s use of such trademarks, logos and trade names shall be in accordance with the guidelines issued by Client or Client Affiliates or its end customer from time to time. The Service Provider shall not contest, at any time, the right of Client or Client Affiliates or its end customer to any trademark or trade name or any other intellectual property used or claimed by Client or Client Affiliates or its end customer. In the event of termination of this Agreement, howsoever caused, the Service Provider’s, right to use such intellectual property, including but not limited to, trademarks, logos or trade names shall cease forthwith from the date of termination of this Agreement. The Service Provider agrees not to attach any additional trademarks, logos or trade designations to the trademarks, logos or trade designations of Client or Client Affiliates or its end customer without the prior written consent of the Client;
                            <br />
                            <br />
                            9.6.	The Service Provider further agrees not to use the Intellectual Property, including but not limited to the copyright, trademarks, logos and trade names of Client or Client Affiliates or its end customer as part of its corporate or partnership name or otherwise;
                            <br />
                            <br />
                            9.7.	The Client reserves the right of prior review and approval of the Service Provider’s use of Client’s or its end customer’s Intellectual Property including but not limited to any copyright, trademarks, logos and trade names as well as all relevant advertisement material. The Service Provider shall not publish, nor cause to be published, any advertisement, or make any representations oral or written, which might confuse, mislead or deceive the public or which are detrimental to the name, trademarks, goodwill or reputation of the Client or its end customer;
                            <br />
                            <br />
                            9.8.	To the extent that the assignment of Deliverables in relation to future medium or mode of exploitation of Deliverables is not held valid by operation of law, notwithstanding and without prejudice to the assignment of such rights in favour of the Client, the Service Provider hereby also grants an irrevocable, exclusive, sub-licensable, perpetual license in the territory of the world to the Client for such future medium or mode of exploitation of the Deliverables as may be developed in the future, in consideration of the service charge paid hereunder to the Service Provider, the sufficiency of which is hereby acknowledged by the Service Provider;
                            <br />
                            <br />
                            9.9.	In instances where there is a requirement to include in the Deliverables, material/services of a third party, the Service Provider agree to obtain all the necessary rights and/or licenses from such third parties for the Client;
                            <br />
                            <br />
                            9.10.	Wherever applicable, the Service Provider will obtain all permission, licenses, releases, consent in writing from each individual whose name, voice, verbal or written statements, or likenesses (reproduced in picture or photographs, whether motion or still) used in the performance of the Services/Deliverables under this Agreement. The Services/Deliverables shall not violate anyone's intellectual property or other rights and the Service Provider confirm and undertake that it has the right to assign exclusive, right, title and ownership on the Deliverables to the Client;
                            <br />
                            <br />
                            9.11.	For the purpose of this clause, the Service Provider and its Personnel shall waive its moral rights and ensure that the third party shall also waive its moral rights in the Services/Deliverables provided under this Agreement.
                            <br />
                            <br />
                        </p>
                        <p className='text-lg font-bold'>
                            10.	 DATA PROTECTION
                            <br />
                        </p>
                        <p>
                            10.1.	Any personal data included in the Services and/or Deliverables shall be processed pursuant to applicable data protection laws in the territory, which may include but not limiting to Information Technology Act, 2000 (as amended) or General Data Protection Regulation of EU (GDPR), on the protection of individuals with regard to the processing of personal data by the Service Provider and/or its Personnel. Such data shall be processed solely for the purposes of the performance, management and monitoring of the Services/Deliverables pursuant to this Agreement.  All personal data acquired by the Service Provider and/or its Personnel shall only be used for the purpose of this Agreement and shall not be further processes or disclosed without the prior written consent of the Client.
                            <br />
                            <br />
                        </p>
                        <p className='text-lg font-bold'>
                            11.	 AUDIT:
                            <br />
                        </p>
                        <p>
                            11.1.	During the term of this Agreement, and for a period of three (3) years thereafter, Client, at its sole expense reserves the right to audit, inspect, and make copies or extracts of relevant financial statements, systems and processes and records (“Documents”) associated with Service Provider’s performance under this Agreement. The scope of this audit will be limited to transactions arising out of or in connection with the terms of this Agreement. Client may conduct audit either directly or through its consultants or agents (“Auditor’) during the normal business hours. However, no such Audit shall be conducted unless the Service Provider has been given advance intimation of seven (7) days in this regard;
                            <br />
                            <br />
                            11.2.	Client or any Auditor appointed by Client, shall have unrestricted access to all Documents whether maintained electronically or otherwise including but not limited to the right to call for Documents and explanations from the employees/Personnel of the Service Provider associated with Service Provider’s performance under this Agreement, as it may think necessary for performance of its duties as an Auditor. Service Provider shall always cooperate and assist with Client and its Auditor and provide all Documents and other relevant data and information associated with Service Provider’s performance under this Agreement, as and when required, for conducting audit including not limited to investigate any allegations/ instances of fraud;
                            <br />
                            <br />
                            11.3.	Client shall always ensure confidentiality of the Documents and findings of the audits, however if required, Client may share the relevant audit observations with its statutory auditors, any internal committee of Client or any other Governmental/ Statutory/ Judicial/ Quasi-Judicial body (ies);
                            <br />
                            <br />
                            11.4.	In the event the audit findings relate, to overcharging, misrepresentations, unethical practice, fraud or breach of terms and conditions of the Agreement, Client shall have all or any of the rights stated herein against the Service Provider (a) to recover the overcharged amount; (b) to suspend/stop all the outstanding/future payments; (c) to terminate the Agreement forthwith without prejudice to other rights under law and contract.
                            <br />
                            <br />
                        </p>
                        <p className='text-lg font-bold'>
                            12.    STATUTORY COMPLIANCE
                            <br />
                        </p>
                        <p>
                            12.1.	Service Provider hereby agrees to comply with all statutory requirements of applicable labour laws including but not limited to the Workmen’s Compensation Act, Trade Unions Act, Industrial Dispute Act, The Bombay Industrial Relations Act, Provident Fund Act, Minimum Wages Act, Employees State Insurance Act, Payment of Bonus Act, Contract Labour (Regulation and Abolition) Act  & Professional Tax Act and all other labour related enactments, rules, regulations to the extent as may be applicable to Service Provider related to its Personnel for rendering Services/Deliverables under this Agreement.  Service Provider shall be responsible for the payment of salaries/wages after all statutory deductions like PF, ESIC, PT, TDS etc. as applicable from time to time and for filing all statutory returns/documents with the concerned authorities.  Further Service Provider shall comply with all statutory laws as may be applicable to its business. Service Provider will keep the Client and its group companies, affiliates, end customer, directors, employees indemnified and harmless at all times from all claims, damages, loss, cost, expense, penalty and all consequences whatsoever on account of Service Provider’s non-compliance of the statutory requirements as mentioned in this clause.
                            <br />
                            <br />
                        </p>
                        <p className='text-lg font-bold'>
                            13.	INSURANCE
                            <br />
                        </p>
                        <p>
                            13.1.	Service Provider shall be responsible to take required insurance for execution of the Event including but not limited to accident insurance, in case of injury or death respectively.
                            <br />
                            <br />
                        </p>
                        <p className='text-lg font-bold'>
                            14.	 INDEMNITY AND LIMITATION OF LIABILITY:
                            <br />
                        </p>
                        <p>
                            14.1.	Service Provider shall indemnify, defend and hold Client and its group companies, affiliates, end customer, its directors, employees harmless against all liability, losses, costs, charges, penalties, damages, fines and expenses (including but not limited to, legal costs and expenses) incurred by Client or its group companies or end customer in connection with any demand, claim (including third party claims) or proceedings or actions  of any nature whatsoever made or instituted against or caused to or suffered by  Client or its group companies or end customer directly or indirectly by reason of or as a result of:
                            <br />
                            <br />
                            <p className='font-medium'>
                                a.	Client availing Services/Deliverables from Service Provider under this Agreement and/or Service Provider deputing its Personnel at the Client’s premises for rendering such Services;
                                <br />
                                b.	Any act or omission including but not limited to wrongful, incorrect, dishonest, theft, robbery, criminal, fraudulent; or negligent work; or default, failure, bad faith, disregard of its duties and obligations hereunder, by Service Provider and/or its Personnel;
                                <br />
                                c.	Any loss or damage to the properties of the Client or its end customer;
                                <br />
                                d.	Due to breach of any of the terms and conditions of this Agreement by Service Provider and/or its Personnel;
                                <br />
                                e.	Any breach of Confidentiality, Intellectual Property and Data Protection clauses as mentioned under this Agreement;
                                <br />
                                f.	any infringement or misappropriation or alleged infringement or misappropriation of a copyright, trademark, proprietary right or any other intellectual property rights or other personal/ privacy rights of any third party by the Service Provider;
                                <br />
                                g.	the Deliverables or the materials provided or used by the Service Provider pursuant to this Agreement.
                                <br />
                                h.	Any claim arising out of or related to the Event or failure to execute the Event.
                            </p>
                            <br />
                            14.2.	In no event shall the Client be liable for any indirect, consequential, special, punitive or exemplary damages including but not limited to loss of business profits etc., arising out of or related to this Agreement. The overall aggregate liability of the Client for any direct damages suffered by the Service Provider for reason solely attributable to the Client shall be limited to the last three months service charge paid by the Client to the Service Provider immediately before such liability has arisen or the value of the relevant PO/SOW whichever is lesser;
                            <br />
                            <br />
                            14.3.	This clause shall survive termination and expiration of this Agreement.
                            <br />
                            <br />
                            <br />
                        </p>
                        <p className='text-lg font-bold'>
                            15.	 NON-EXCLUSIVITY OF SERVICES
                            <br />
                        </p>
                        <p>
                            15.1.	Notwithstanding anything to the contrary mentioned herein, Client shall have all rights in respect of engaging, consulting or appointing any third parties for providing parts of Services or such similar Services/Deliverables during the Term of this Agreement or thereafter;
                        </p>
                        <br />
                        <br />
                        <p className='text-lg font-bold'>
                            16.	 TERMINATION:
                            <br />
                        </p>
                        <p>
                            16.1	Client reserves the right to terminate this Agreement:
                            <br />
                            <br />
                            a)	On convenience by giving an advance written notice of 30 (thirty) days to the Service Provider;
                            b)	In the event the Service Provider commits any material breach of the terms of this Agreement and fails to rectify the same within 15 (fifteen) days of receipt of written notice of such breach from Client;
                            <br />
                            <br />
                            16.2	The Service Provider reserves the right to terminate this Agreement in the event Client does not pay within the credit period as agreed under this Agreement and fails to rectify the same within 60 (sixty) days of receipt of written notice of such payment breach from the Service Provider.
                            <br />
                            <br />
                            16.3	In the event of termination of the Agreement, Service Provider shall within 5 (five) days from the date of termination refund to Client the pro-rata sum already received as service charge, for the remainder of Term of Services or Deliverables. This right shall be without prejudice to any other right or remedy that Client may have under the law.
                            <br />
                            <br />
                        </p>
                        <p className='text-lg font-bold'>
                            17.   ANTI BRIBERY:
                            <br />
                        </p>
                        <p>
                            17.1.	Client’s policy strictly forbids the acceptance of a gift or a business favor or a loan to employee of the Client from a service provider, client or vendor doing or seeking to do business with the Client. This policy prohibits the donation of outright gifts to the employees of the Client. Personal dealings between Client’s employee and any Individual or company who does, or seeks to do, business with the Client in any manner are strictly prohibited;
                            <br />
                            <br />
                            17.2.	The Service Provider shall ensure that its Personnel(s), employee(s), directors(s), agent(s), sub-contractor(s) shall at all times adhere to all applicable laws in the territory, including but not limited to the anticorruption and anti-bribery laws, provisions of the Foreign Corrupt Practices Act, 1977 of United States of America and UK Anti-Bribery, Act, 2010 etc;
                            <br />
                            <br />
                            17.3.	Neither the Service Provider nor any Personnel, director, officer, agent employee, contractor(s), sub-contractor(s) or any other person acting for or on behalf of the foregoing has offered, paid, promised to pay, or authorized the payment of any money or anything of value, to any government authority, public official or any political party for the purpose of influencing any act or decision of such government authority, public official or political party in relation to the Agreement or direct business to any person, in each case where such payment, offer or promise is prohibited under any applicable law to which such entity is subject; or engaged in any activity that would in any manner result in violation of any applicable anti-bribery and/or anti-corruption laws in India and/or the Foreign Corrupt Practices Act, 1977 of the United States of America and/or under the UK Bribery Act 2010.
                            <br />
                            <br />
                        </p>
                        <p className='text-lg font-bold'>
                            18.	  MISCELLANEOUS
                            <br />
                        </p>
                        <p>
                            18.1.	During the term of this Agreement and for a period of 1 (one) year thereafter, the Service Provider shall not directly or indirectly hire or engage as an employee, freelancer, subcontractor or agent any employee or contractor or agent of the Client without the prior written consent of the Client;
                            <br />
                            <br />
                            18.2.	The Service Provider will comprehensively take the required insurance to cover its business, services and assets (including its customer’s) against all loss or damage, including loss or damage by fire, floods, riots and other natural calamities, theft, sabotage and other human inflicted loss or damages. The Service Provider shall procure insurance for its employees, Personnel and associates in accordance with applicable laws and human resources policies;
                            <br />
                            <br />
                            18.3.	Any notice shall be deemed to be given on the day of sending if sent by email or fax and 3 (three) days from the date of sending if sent by letter at the address of respective Parties mentioned hereinabove;
                            <br />
                            <br />
                            18.4.	This Agreement together with recitals, annexes, documents referred to in it and any addendum hereto contain the entire agreement between the Parties relating to the transactions contemplated by this Agreement and supersede al previous agreements between the Parties, whether oral or written, relating to subject matter hereof; This Agreement shall prevail over any terms, provisions or conditions of any Service Provider purchase order, insertion order, acknowledgment, click-through agreement or other business form that Service Provider may use
                            <br />
                            <br />
                            18.5.	No amendment or modification to this Agreement and no waiver of any of the terms or conditions hereof shall be valid or binding unless made in writing and duly executed by each Party;
                            <br />
                            <br />
                            18.6.	Failure by either Party to enforce at any time or for any period any one or more of the terms or conditions of this Agreement shall not be a waiver of them or of the right at any time subsequently to enforce all terms and conditions of this Agreement;
                            <br />
                            <br />
                            18.7.	Service Provider shall not be entitled to assign, subcontract, license or engage any third party to perform the Services/Deliverables or part thereof, in accordance with this Agreement, without taking the prior written approval of the Client;
                            <br />
                            <br />
                            18.8.	It is clarified that this Agreement is on a principal-to-principal basis and does not create and shall not be deemed to be created any employer-employee or a principal-agent relationship between Client and the Service Provider and/or its Personnel. Service Provider and/or its Personnel shall not be entitled to, by act, word, deed, or otherwise make any statement on behalf of the Client or in any manner bind the Client or hold out or represent that the Service Provider is representing or acting as an agent of the Client;
                            <br />
                            <br />
                            18.9.	This Agreement shall be governed by and construed in accordance with the laws of India. The courts of Mumbai shall have exclusive jurisdiction to try any disputes arising out of this Agreement.
                            <br />
                            <br />
                            18.10.	Unless otherwise expressly provided in this Agreement, all taxes, duties, levies, charges applicable to this Agreement and/or any subsequent document pursuant to this Agreement and incidental to the services provided hereunder shall be borne by the Service Provider at all times. This obligation shall survive the termination and / or expiry of this Agreement and the Service Provider shall indemnify Client for any breach of this obligation.
                            <br />
                            <br />
                            The Parties acknowledge that due to the nature of this Agreement, the total value of the Agreement cannot be determined at the time of execution of the Agreement.  Accordingly, a nominal stamp duty is being paid by the Service Provider on this Agreement at the time of execution of the Agreement.  The Service Provider agrees that any additional amounts payable by way of stamp duty on the Agreement in order to enable claims under the Agreement to be made in full shall be borne by the Service Provider as and when required.
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                        </p>
                        <p className='text-center'>
                            <b>IN WITNESS WHEREOF, parties have executed this Agreement as of the Execution Date.</b>
                        </p>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <div className='flex flex-row justify-between'>
                            <p>
                                <b>For and on behalf of
                                    <br />
                                    OMNICOM MEDIA GROUP INDIA PVT. LTD.
                                </b>
                            </p>
                            <p>
                                <b>For and on behalf of
                                    <br />
                                    {data?.name}
                                </b>
                            </p>
                        </div>
                        <br />
                        <div className='flex flex-row justify-between'>
                            <p>
                                <b>
                                    Signed by: Vijay Basantani
                                    <br />
                                    <br />
                                    <br />
                                    Designation: SVP - Finance
                                </b>
                            </p>
                            <p>
                                <b>Signed by: {data?.name}
                                    {sign ? <img src={sign} alt="Signature" className="signImage my-2 ms-3" /> :
                                        <>
                                            <br />
                                            <br />
                                            <br />
                                        </>}
                                    Designation: {data?.designation}
                                </b>
                            </p>
                        </div>
                        <br />
                        <br />


                        {/* <p className='text-center'>
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
                        </div> */}
                    </div>
                }
            </div>
        )
    };

    return (
        <>
            <div>
                <ComponentPrint />
                {data && data?.forms?.msa === 2 ? <button id="printbtn" className='rounded-lg bg-blue-800 text-white w-full p-2 my-3' onClick={handlePrint}>Print</button> : ""}

            </div>
        </>
    )


}

export default ExportNDA