import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Mail, ArrowRight } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }

    console.log('Register:', { name, email, password });

    // Giả lập đăng ký thành công
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#d1d9e2] flex items-center justify-center p-4 font-sans text-[#1a2b4b]">
      <div className="max-w-md w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0a1931] text-[#e5c49e] rounded-2xl mb-4 shadow-xl">
            <User size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#0f172a] tracking-tighter uppercase">
            Đăng ký tài khoản
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            Tạo tài khoản để sử dụng hệ thống
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#aeb9c7] p-8 rounded-3xl shadow-sm border border-white/20">
          <form onSubmit={handleRegister} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 pl-12 bg-white/80 rounded-2xl outline-none focus:ring-2 focus:ring-[#0f172a] text-sm font-semibold"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 pl-12 bg-white/80 rounded-2xl outline-none focus:ring-2 focus:ring-[#0f172a] text-sm font-semibold"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pl-12 bg-white/80 rounded-2xl outline-none focus:ring-2 focus:ring-[#0f172a] text-sm font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-4 pl-12 bg-white/80 rounded-2xl outline-none focus:ring-2 focus:ring-[#0f172a] text-sm font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#0f172a] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 group"
            >
              ĐĂNG KÝ
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-8 font-medium">
          Đã có tài khoản?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-[#0f172a] font-bold cursor-pointer hover:underline"
          >
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;