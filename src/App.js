import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import PrivateRoutes from './utils/PrivateRoutes';
import IntroducerRoutes from './utils/IntroducerRoutes';
import Register from './components/pages/register';
import Login from './components/pages/login';
import Dashboard from './components/pages/dashboard';
import NavigationBars from './components/reusable/navigation';
import Profile from './components/pages/profile';
import Queries from './components/pages/queries';
import ExportGST from './components/forms/GST/exportGST';
import VendorDetails from './components/forms/vendorDetails/vendorDetails';
import ExportEInvoicing from './components/forms/vendorEInvoicing/exportEInvoicing';
import BankDetailsForm from './components/forms/vendorBankdetails/bankdetailsForm';
import ExportMSA from './components/forms/nondisclosure/exportMSA';
import UploadDocuments from './components/forms/uploadDocuments/uploadDocuments';
import store from './store/store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReferVendors from './components/pages/referVendors';
import { useEffect, useState } from 'react';
import NonApplicabilityGST from './components/forms/GST/nonApplicabilityGST';
import Approval from './components/pages/approval';
import MSAForm from './components/forms/nondisclosure/msaForm';
import Trainee from './components/forms/trainee form/trainee';
import TraineeDocumentUpload from './components/forms/trainee form/traineeDocumentUpload';

function App() {
  const [type, settype] = useState('');
  // if (sessionStorage.getItem('accessToken') && window.location.pathname === "/" ) {
  //   window.location.href = "/dashboard";
  // }

  useEffect(() => {
    const usertype = sessionStorage.getItem('usertype')
    settype(usertype);
  }, [])


  return (
    <>
      <Provider store={store}>
        <div className={sessionStorage.getItem('accessToken') ? 'App' : 'd-flex justify-content-center align-items-center'} style={{ height: "100%" }}>
          <BrowserRouter>
            <NavigationBars />
            <div className="d-flex justify-content-center align-items-center">
              <Routes>
                {type === "vendor" &&
                  <>
                    {/* Private/Vendor Routes */}
                    <Route element={<PrivateRoutes />}>
                      <Route path='/dashboard' exact element={<Dashboard />} />
                      <Route path='/nonapplicability' element={<NonApplicabilityGST />} />
                      <Route path='/exportgst' element={<ExportGST />} />
                      <Route path='/vendor-form' element={<VendorDetails />} />
                      <Route path='/vendor-einvoicing' element={<ExportEInvoicing />} />
                      <Route path='/vendor-bankdetails' element={<BankDetailsForm />} />
                      <Route path='/msa' element={<MSAForm />} />
                      <Route path='/exportmsa' element={<ExportMSA />} />
                      <Route path='/profile' element={<Profile />} />
                      <Route path='/queries' element={<Queries />} />
                      <Route path='/upload-documents' element={<UploadDocuments />} />
                      <Route path='/mt-vendor-form' element={<Trainee />} />
                      <Route path='/mt-upload-documents' element={<TraineeDocumentUpload />} />
                    </Route>
                  </>
                }
                {type === "introducer" &&
                  <>
                    {/* Introducer Routes */}
                    <Route element={<IntroducerRoutes />}>
                      <Route path='/dashboard' exact element={<Dashboard />} />
                      <Route path='/profile' element={<Profile />} />
                      {/* <Route path='/refervendors' element={<ReferVendors />} /> */}
                    </Route>
                  </>
                }
                {/* Public Routes */}
                <Route path='/approve/:uid' element={<Approval />} />
                <Route path='/register' exact element={<Register />} />
                <Route path='/' exact element={<Login />} />
              </Routes>

            </div>
          </BrowserRouter>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Provider>
    </>
  );
}

export default App;