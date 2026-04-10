import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, ArrowRight } from 'lucide-react'
import { ACCESS_TOKEN_KEY, loginApi } from '../api/authApi'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      alert('Missing email or password')
      return
    }

    try {
      setIsSubmitting(true)
      const result = await loginApi({
        email: email.trim(),
        password,
      })
      localStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken)
      window.location.href = '/invoices'
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      alert(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#d1d9e2] flex items-center justify-center p-4 font-sans text-[#1a2b4b]">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0a1931] text-[#e5c49e] rounded-2xl mb-4 shadow-xl">
            <Lock size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#0f172a] tracking-tighter uppercase">Invoice System</h1>
          <p className="text-gray-600 mt-2 font-medium">Sign in to manage invoices</p>
        </div>

        <div className="bg-[#aeb9c7] p-8 rounded-3xl shadow-sm border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">
                Account / Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-500 group-focus-within:text-[#0f172a] transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 pl-12 bg-white/80 backdrop-blur-sm rounded-2xl outline-none focus:ring-2 focus:ring-[#0f172a] transition-all text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-500 group-focus-within:text-[#0f172a] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0f172a] text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="text-center">
            <p className="text-sm text-gray-500 font-medium">
              Chưa có tài khoản?{' '}
              <button 
                type="button"
                onClick={() => navigate('/register')} 
                className="text-[#0f172a] font-extrabold hover:underline cursor-pointer">Đăng ký 
              </button>
            </p>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
