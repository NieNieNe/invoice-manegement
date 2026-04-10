import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Component/Sidebar'; 
import ItemDetailsForm from './form_checkout/checkout';
import PaymentQueue from './Confirm_Payment/confirm_payment';
import RecordBill from './RecordBill/RecordBill';
import Login from './Login/login'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <Sidebar>
              <Routes>
                <Route path="/" element={<Navigate to="/invoices" replace />} />
                
                <Route path="/invoices" element={<ItemDetailsForm />} />
                <Route path="/payments" element={<PaymentQueue />} />
                <Route path="/record-bill" element={<RecordBill />} />
                <Route path="/dashboard" element={<div className="p-8">Dashboard Page</div>} />
                
                <Route path="*" element={<div className="p-8">404 - Không tìm thấy trang</div>} />
              </Routes>
            </Sidebar>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;