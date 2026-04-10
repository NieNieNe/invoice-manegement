import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  ReceiptText,
  LogOut
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const ACCESS_TOKEN_KEY = 'accessToken';

  const menuItems = [
    { name: 'Đơn Hàng', icon: <LayoutDashboard size={20} />, path: '/invoices' },
    { name: 'Phiếu Báo Nợ', icon: <ReceiptText size={20} />, path: '/record-bill' },
    { name: 'Hóa Đơn Thanh Toán', icon: <CreditCard size={20} />, path: '/payments' },
  ];

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.location.href = '/login';
  };

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

        <div className="px-4 pb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-200"
          >
            <LogOut size={20} />
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
