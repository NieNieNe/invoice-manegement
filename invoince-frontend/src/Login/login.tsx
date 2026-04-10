import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ArrowRight } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Giả lập logic đăng nhập thành công
    console.log('Logging in with:', { email, password });
    navigate('/invoices'); 
  };

  return (
    <div className="min-h-screen bg-[#d1d9e2] flex items-center justify-center p-4 font-sans text-[#1a2b4b]">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0a1931] text-[#e5c49e] rounded-2xl mb-4 shadow-xl">
            <Lock size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#0f172a] tracking-tighter uppercase">Hệ Thống Invoice</h1>
          <p className="text-gray-600 mt-2 font-medium">Vui lòng đăng nhập để quản lý hóa đơn</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#aeb9c7] p-8 rounded-3xl shadow-sm border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">
                Tài khoản / Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-500 group-focus-within:text-[#0f172a] transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@invoice.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 pl-12 bg-white/80 backdrop-blur-sm rounded-2xl outline-none focus:ring-2 focus:ring-[#0f172a] transition-all text-sm font-semibold"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                  Mật khẩu
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-500 group-focus-within:text-[#0f172a] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pl-12 bg-white/80 backdrop-blur-sm rounded-2xl outline-none focus:ring-2 focus:ring-[#0f172a] transition-all text-sm font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-[#0f172a]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#0f172a] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-black hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group"
            >
              ĐĂNG NHẬP
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-gray-500 text-xs mt-8 font-medium">
          © 2026 Invoice Management System. <br/> Bảo mật thông tin bởi SSL 256-bit.
        </p>
      </div>
    </div>
  );
};

export default Login;