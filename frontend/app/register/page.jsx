'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterForm() {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // ✅ Fixed handleChange
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const result = await register({
      full_name: form.full_name,
      email: form.email,
      password: form.password,
    });

    if (!result.success) {
      alert(result.error || 'Registration failed');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-[#2f3136]/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-bold text-white">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={form.full_name}
                onChange={handleChange}
                className="bg-[#202225] text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-bold text-white">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="bg-[#202225] text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-bold text-white">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="bg-[#202225] w-full text-white placeholder-gray-400 p-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-white"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-bold text-white">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="bg-[#202225] w-full text-white placeholder-gray-400 p-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-3 text-white"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Register
            </button>
          </form>
          <p className="text-sm text-gray-400 mt-4 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
