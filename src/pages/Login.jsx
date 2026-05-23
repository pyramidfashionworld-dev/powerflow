import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { USERS } from '../data/mockData'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      const user = USERS.find(
        u => u.email === form.email && u.password === form.password
      )
      if (user) {
        localStorage.setItem('pf_user', JSON.stringify({ id: user.id, name: user.name, role: user.role, email: user.email }))
        navigate('/dashboard')
      } else {
        setError('Invalid email or password.')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">

      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 60px)' }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">PowerFlow</h1>
          <p className="text-slate-400 text-sm mt-1">Utility Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white font-semibold text-lg mb-1">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-6">Sign in to continue to your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="admin@utility.com"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <p className="text-slate-500 text-xs text-center mb-2">Demo credentials</p>
            <div className="space-y-1 text-xs text-slate-400 text-center">
              <p>admin@utility.com / admin123</p>
              <p>rajesh@utility.com / user123</p>
            </div>
          </div>
        </div>

        <p className="text-slate-600 text-xs text-center mt-6">PowerFlow © 2025</p>
      </div>
    </div>
  )
}
