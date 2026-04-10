import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  ReceiptText
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Đơn Hàng', icon: <LayoutDashboard size={20} />, path: '/invoices' },
    { name: 'Phiếu Báo Nợ', icon: <ReceiptText size={20} />, path: '/record-bill' },
    { name: 'Hóa Đơn Thanh Toán', icon: <CreditCard size={20} />, path: '/payments' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <div className="w-64 bg-[#0a1931] text-white flex flex-col shrink-0">
        <div className="p-8 text-xl font-bold tracking-tight">
          INVOICE
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {

            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  isActive 
                    ? 'bg-[#e5c49e] text-[#0a1931]'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;